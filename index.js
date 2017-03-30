(function () {

    angular.module("pizzaChallenge", [])
        .controller("indexController", indexController);

    function indexController($http, $anchorScroll, $location, $timeout) {

        var vm = this;
        vm.groupPizzas = groupPizzas;
        vm.fixJson = fixJson;
        vm.prepareResult = prepareResult;
        vm.sendResult = sendResult;

        vm.pizzaMenu = {
            "pizzas": [{ "margherita": { "ingredients": ["tomato_sauce", "mozzarella_cheese"] }, "price": 5 },
            { "funghi": { "ingredients": ["tomato_sauce", "mozzarella_cheese", "mushrooms"] }, "price": 7 },
            { "nil": "nil" },
            {"capricciosa": {"ingredients": ["tomato_sauce", "mozzarella_cheese", "mushrooms", "ham", "eggs", "artichoke", 
            "cocktail_sausages","green_olives"]}, "price": 10},
            {"quattro_stagioni": {"ingredients": ["tomato_sauce", "mozzarella_cheese", "ham", "black_olives", "mushrooms", 
            "artichoke", "peas","salami", "eggs"]}, "price": 12},
            {"vegetariana": { "ingredients": ["tomato_sauce", "mozzarella_cheese", "mushrooms", "artichoke", "sweet_corn",
            "peppers"]},"price": 10},
            { "quattro_formaggi": { "ingredients": ["tomato_sauce", "mozzarella", "parmesan_cheese", "blue_cheese", "goat_cheese"] },
             "price": 9 },
            { "marinara": { "ingredients": ["tomato_sauce", "mozzarella_cheese", "shrimps", "mussels", "tuna", "calamari",
            "crab_meat"] }, "price": 11 },
            { "peperoni": { "ingredients": ["tomato_sauce", "mozzarella_cheese", "peperoni_peppers"] }, "price": 6 },
            { "napolitana": { "ingredients": ["tomato_sauce", "anchovies", "olives", "capers"] }, "price": 8 },
            { "hawaii": { "ingredients": ["tomato_sauce", "mozzarella_cheese", "ham", "pineapple"] }, "price": 9 },
            { "calzone": { "ingredients": ["tomato_sauce", "mozzarella_cheese", "mushrooms", "ham", "eggs"] }, "price": 10 },
            { "nil": "nil" },
            { "rucola": { "ingredients": ["tomato_sauce", "mozzarella_cheese", "ham", "parmesan_cheese", "rucola"] }, "price": 13 },
            { "bolognese": { "ingredients": ["tomato_sauce", "mozzarella_cheese", "minced_meat", "onion", "fresh_tomato"] }, 
            "price": 10 },
            { "meat_feast": { "ingredients": ["tomato_sauce", "mozzarella_cheese", "minced_meat", "sausage"] }, "price": 12 },
            { "kebabpizza": { "ingredients": ["tomato_sauce", "mozzarella_cheese", "kebab", "onion", 
            "green_peperoncini_peppers"]},"price":12},
            {"mexicana": {"ingredients": ["tomato_sauce", "mozzarella_cheese", "minced_beef", "jalapenos_peppers", 
            "sweet_corn", "onion","spicy_sauce"]}, "price": 12}]};

        fixJson();

        function groupPizzas() {
            vm.groups = []
            var meat = {"name" : "Pizzas with meat", "pizzas" : []};
            var muchCheese = {"name" : "Pizzas with more than one type of cheese", "pizzas" : []};
            var meatOlives = {"name" : "Pizzas with meat and olives", "pizzas" : []};
            var mozzShroom = {"name" : "Pizzas with mozzarella and mushrooms", "pizzas" : []};

            var meatTags = ["meat", "ham", "salami", "tuna", "crab", "mussel", "calamari", "shrimp", "beef",
                "anchovies", "kebab", "minced", "sausage"];

            vm.pizzaMenu.forEach(function (pizza) {
                var hasMeat = false;
                var numbCheese = 0;
                var hasMozzarella = false;
                var hasOlives = false;
                var hasShrooms = false;
                pizza["ingredients"].forEach(function (ingredient) {
                    //check if pizza has meat in it
                    if (!hasMeat) {
                        for(var mt in meatTags) {
                            if (ingredient.includes(meatTags[mt])) {
                                hasMeat = true;
                                meat["pizzas"].push(pizza);
                                break;
                            }
                        }
                    }
                    //check if pizza has cheese (in json 'mozzarella' is written once without '_cheese' at the end )
                    if (ingredient.includes("cheese") || ingredient.includes("mozzarella")) {
                        numbCheese++;
                        if (ingredient.includes("mozzarella"))
                            hasMozzarella = true;
                        if (numbCheese == 2)
                            muchCheese["pizzas"].push(pizza);
                    }
                    //check if pizza has olives
                    if (ingredient.includes("olives"))
                        hasOlives = true;
                    //check if pizza has shrooms
                    if (ingredient.includes("mushrooms"))
                        hasShrooms = true;
                });
                if (hasMeat && hasOlives)
                    meatOlives["pizzas"].push(pizza);
                if (hasMozzarella && hasShrooms)
                    mozzShroom["pizzas"].push(pizza);
            });

            vm.groups.push(meat, muchCheese, meatOlives, mozzShroom);
            vm.prepareResult();

            //scroll to the bottom of the page
            $timeout(function() {
                $location.hash("group");
                $anchorScroll();
            });
        }

        //transform input json into the one I find easier to work with
        function fixJson() {

            var pizzas = vm.pizzaMenu["pizzas"];
            var res = [];
            pizzas.forEach(function (pizza) {
                var name = undefined;
                var price = undefined;
                for (var key in pizza) {
                    if (pizza.hasOwnProperty(key)) {
                        if (key != "price")
                            name = key;
                        else if (key == "price")
                            price = pizza[key];
                    }
                }
                if (name != "nil")
                    res.push({ "name": name, "price": price, "ingredients": pizza[name]["ingredients"] });
            }, this);
            vm.pizzaMenu = res;
        }

        //create json with results for RenderedText
        function prepareResult() {
            
            vm.result = {"personal_info" : {"full_name" : "Nemanja Zunic", "email" : "n.zunic@yahoo.com",
                "code_link" : "https://github.com/C0mpy/pizza-challenge-2017"}};
            var answer = [];
            
            for(var i in vm.groups) {
                var cheapest = {"price" : Number.MAX_VALUE};
                vm.groups[i]["pizzas"].forEach(function(pizza) {
                    if(cheapest["price"] > pizza["price"]) {
                        cheapest = pizza;
                    }
                });
                var obj = {}; 
                var percentage = vm.groups[i]["pizzas"].length / vm.pizzaMenu.length * 100;
                var numb = parseInt(i) + 1;
                obj["group_" + numb] = {"percentage" : percentage, "cheapest" : cheapest};
                answer.push(obj);
            }
            vm.result.answer = answer;
        }

        //send http post request with json data results to RenderedText
        function sendResult() {
            $http.post("http://coding-challenge.renderedtext.com/submit", vm.result).then(
                function() {
                    alert("Results successfully sent to RenderedText! :)");
                }, 
                function() {
                    alert("Oh No! It was an error :(")
                }
            );
        }

    }

})();