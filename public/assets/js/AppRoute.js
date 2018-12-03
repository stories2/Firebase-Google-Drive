app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "templates/default/index.html",
            controller : "DefaultPageController",
            cache: false,
            disableCache: true,
        })
        .otherwise({
            redirectTo: '/',
            cache: false,
            disableCache: true,
        });
});