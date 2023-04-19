export const AVERAGE_BLOCK_TIME_IN_SECS = 12;
export const STORAGE_KEY_INSCRIBER_ID = "INSCRIBER_ID"
export const IS_DEVELOPMENT = true;

export const MIN_FEE_RATE = 10;
export const MAX_FEE_RATE = 25;

export const DEV_FILE_MAXSIZE = 20000; // 20KB - testnet
export const PRO_FILE_MAXSIZE = 400000; // 400KB - mainnet

export const FILE_MAXSIZE = IS_DEVELOPMENT ? DEV_FILE_MAXSIZE : PRO_FILE_MAXSIZE;

export const UNISAT_NETWORK_NAME = IS_DEVELOPMENT ? "testnet" : "livenet"

export const DEV_API_PATH = "http://localhost:3306/api";
export const PROD_API_PATH = "https://ordauction.cryptosnowprince.com/api";
// export const PROD_API_PATH = "https://inscribe.ordinal.art/api";

export const API_PATH = IS_DEVELOPMENT ? DEV_API_PATH : PROD_API_PATH;

const TESTNET_EXPLORER = "https://testnet.hariwhitedream.com";// "http://127.0.0.1:5000";
const MAINNET_EXPLORER = "https://ordinals.com";
export const EXPLORER_URL = IS_DEVELOPMENT ? TESTNET_EXPLORER : MAINNET_EXPLORER;

export const ADMIN_ADDRESS = IS_DEVELOPMENT ? ["tb1q8zcn0ackfwq0jd7fjrxgc0k07x2sv3cf0lh4s6"] : ["bc1qakj552djms5p7gr3edp8we6rqaqqej970a2sal"];

export const ALERT_EMPTY = "";
export const ALERT_SUCCESS = "success";
export const ALERT_WARN = "warning";
export const ALERT_ERROR = "error";

export const ALERT_REFETCH = 10000;

export const ALERT_DELAY = 3000;
export const ALERT_POSITION = "top-right";

export const SUCCESS = "SUCCESS";
export const FAIL = "FAIL";

export const SERVICE_FEE = 40000;
export const OUTPUT_UTXO = 10000;

export const BECH32_EXAMPLE = "bc1pgrc6jtuaqajm347356xgsk7aeapnh6pnkac2mxa4dm3vq04ezc3qt6g8xs";

////// Signing Messages
export const MESSAGE_LOGIN = "Sign in to the OrdAuction!";
