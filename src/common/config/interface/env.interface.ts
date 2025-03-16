interface IEnvObject {
  CONFIG: {
    environment: string;
    mongodb: string;
    port: number;
    defaultLimit: number;
  };
  PAGINATION: {
    DEFAULT_LIMIT: number;
  };
}
