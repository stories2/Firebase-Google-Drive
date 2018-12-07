var LOG_LEVEL_VERBOSE = 0;
var LOG_LEVEL_INFO = 1;
var LOG_LEVEL_DEBUG = 2;
var LOG_LEVEL_WARN = 3;
var LOG_LEVEL_ERROR = 4;

var DEBUGGING_URL = ""
var DEBUGGING_URL = "/Firebase-Google-Drive/public" // <-- comment when you deploy this project

var ROUTE_DEFAULT_URL = "/#!/"
var ROUTE_DRIVE_URL = "/#!/drive"

var API_PRIVATE_API_ENDPOINT = "https://us-central1-fir-drive-4df77.cloudfunctions.net/privateApi/"
var API_GET_DIRECTORY_STRUCTURE = API_PRIVATE_API_ENDPOINT + "dir/"
var API_GET_FILE_INFO = API_PRIVATE_API_ENDPOINT + "file/"
var API_GET_FILE_DOWNLOAD_LINK = API_PRIVATE_API_ENDPOINT + "file/share/"
var API_POST_FILE_UPLOAD = API_PRIVATE_API_ENDPOINT + "file"

var TYPE_FILE = "file"
var TYPE_FOLDER = "folder"

var TOAST_FILE_UPLOAD_OK = "파일 업로드 성공"
var TOAST_FILE_UPLOAD_FAIL = "파일 업로드 실패"

var TOAST_SHOW_SHORT = 800
var TOAST_SHOW_LONG = 3000