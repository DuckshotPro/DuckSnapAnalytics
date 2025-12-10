import os
import sys
import json
import asyncio
import redis
import time
from agents.orchestrator_agent import OrchestratorAgent

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Redis Configuration
REDIS_HOST = os.environ.get("REDIS_HOST", "localhost")
REDIS_PORT = int(os.environ.get("REDIS_PORT", 6379))
REDIS_PASSWORD = os.environ.get("REDIS_PASSWORD", None)
TASK_QUEUE_KEY = "ducksnap_tasks"

def get_redis_connection():
    try:
        r = redis.Redis(
            host=REDIS_HOST,
            port=REDIS_PORT,
            password=REDIS_PASSWORD,
            decode_responses=True
        )
        r.ping()
        print(f"✅ Connected to Redis at {REDIS_HOST}:{REDIS_PORT}")
        return r
    except redis.ConnectionError as e:
        print(f"❌ Failed to connect to Redis: {e}")
        return None

async def process_task(task_data):
    try:
        user_id = task_data.get("userId")
        if not user_id:
            print("⚠️ Received task with no userId")
            return

        print(f"🤖 Starting Orchestrator Agent for User ID: {user_id}")
        
        # Run the agent
        orchestrator = OrchestratorAgent()
        result = await orchestrator.run(user_id)
        
        print(f"✅ Agent workflow completed for User {user_id}")
        print(f"   Result Summary: {json.dumps(result, default=str)[:100]}...")
        
    except Exception as e:
        print(f"❌ Error processing task for user {user_id}: {e}")
        import traceback
        traceback.print_exc()

def run_worker():
    print("🚀 DuckSnap Python Worker Starting...")
    r = get_redis_connection()
    
    if not r:
        print("❌ Could not connect to Redis. Exiting.")
        sys.exit(1)

    print(f"👂 Listening for tasks on queue: '{TASK_QUEUE_KEY}'")
    
    while True:
        try:
            # BRPOP blocks until a task is available
            # Returns tuple: (key, value)
            task = r.brpop(TASK_QUEUE_KEY, timeout=5)
            
            if task:
                queue_name, task_json = task
                print(f"📥 Received task: {task_json}")
                
                try:
                    task_data = json.loads(task_json)
                    # Run async task in synchronous loop
                    asyncio.run(process_task(task_data))
                except json.JSONDecodeError:
                    print(f"❌ Failed to decode task JSON: {task_json}")
            
        except redis.ConnectionError:
            print("⚠️ Redis connection lost. Reconnecting in 5s...")
            time.sleep(5)
            r = get_redis_connection()
        except Exception as e:
            print(f"❌ Unexpected worker error: {e}")
            time.sleep(1)

if __name__ == "__main__":
    run_worker()
