export enum EKeyModule {
  Persistence = "persistence",
  Auth = "auth",
}

export class SKey {

  private readonly _keys: string[] = [];
  private readonly _serializable: boolean = true;

  constructor(keys: string[], serializable: boolean = true) {
    this._keys = keys || [];
    this._serializable = serializable;
  }

  public asKey(): string {
    return this._keys.map(x => x.trim().toLowerCase().replace('_', "/:")).join('_');
  }

  public get Serializable(): boolean {
    return this._serializable;
  }
}


export class StorageKeys {

  constructor() {
  }

  public static readonly LastPersistedEmailKey : SKey = StorageKeys.frameKey(EKeyModule.Persistence, ["email"]);
  public static readonly LastPersistedSettings : SKey = StorageKeys.frameKey(EKeyModule.Persistence, ["settings"]);
  public static readonly AuthTokens : SKey = StorageKeys.frameKey(EKeyModule.Auth, ["access"]);

  public static frameKey(module: EKeyModule | string, routes: string[]) : SKey{
    if(!routes || routes.length == 0){
      throw new Error("No routes specified");
    }

    return new SKey([module.toString(), ...routes]);
  }

}
