var app = angular.module('chummer-sheet-hoster', [
    'ui.bootstrap',
    'ngNewRouter'
]);

app.config(function ($componentLoaderProvider) {
    $componentLoaderProvider.setTemplateMapping(function (name) {
        return name + '.html';
    });
});

app.controller('IndexController', function ($scope, $http, $router) {
    $scope.characters = [];

    $router.config([
        {path: '/:name', component: 'character'}
    ]);

    $http.get('/api/character').success(function (data) {
        $scope.characters = data;
    }).error(function (err) {
        console.error(err);
    });

    $scope.selectCharacter = function (character) {
        window.location.href = '/#/' + character;
    };

    $scope.isActive = function () {
        return window.location.hash === '' || window.location.hash === '#' || window.location.hash === '#/';
    };
});

app.controller('CharacterController', ['$routeParams', '$http', function ($routeParams, $http) {
    var self = this;

    self.characterFile = $routeParams.name;
    self.character = {};

    $http.get('/api/character/' + self.characterFile).success(function (data) {
        self.character = data.characters.character[0];
        console.log(self.character);
    }).error(function (err) {
        console.error(err);
    });
}]);