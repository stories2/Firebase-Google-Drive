exports.helloWorld = function(request, response) {

    global.log.info("index", "helloWorld", "this is info")
    global.log.debug("index", "helloWorld", "this is debug")
    global.log.warn("index", "helloWorld", "this is warn")
    global.log.error("index", "helloWorld", "this is error")

    response.send("Hello from Firebase! - logging test 2");
};