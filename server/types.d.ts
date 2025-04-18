declare module 'passport-oauth2' {
  import { Strategy } from 'passport';
  
  interface OAuth2StrategyOptions {
    authorizationURL: string;
    tokenURL: string;
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string | string[];
    passReqToCallback?: boolean;
    state?: boolean;
    pkce?: boolean;
    customHeaders?: Record<string, string>;
  }
  
  interface OAuth2VerifyCallback {
    (err: Error | null, user?: any, info?: any): void;
  }
  
  interface OAuth2VerifyFunction {
    (
      accessToken: string,
      refreshToken: string,
      params: any,
      profile: any,
      done: OAuth2VerifyCallback
    ): void;
  }
  
  interface OAuth2VerifyFunctionWithRequest {
    (
      req: any,
      accessToken: string,
      refreshToken: string,
      params: any,
      profile: any,
      done: OAuth2VerifyCallback
    ): void;
  }
  
  export class Strategy implements Strategy {
    constructor(
      options: OAuth2StrategyOptions,
      verify: OAuth2VerifyFunction | OAuth2VerifyFunctionWithRequest
    );
    
    name: string;
    authenticate(req: any, options?: any): void;
  }
}