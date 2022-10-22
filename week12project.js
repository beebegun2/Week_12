class Tea {
    constructor(name){
        this.name = name;
        this.flavors = [];
    }

    addFlavor(name, topping) {
        console.log('adding toppings here', topping);
        this.flavors.push(new Flavor(name, topping));
    }
}

class Flavor {
    constructor(name, topping) {
        console.log('this is the class of flavor and topping', Flavor);
        this.name = name;
        this.topping = topping;
    }
}

class TeaService {
    static url = 'https://63501dda78563c1d82b9a7b2.mockapi.io/teas';

    static getAllTeas() {
        return $.get(this.url);
    }

        static getTea(id) {
        return $.get(this.url + `/${id}`);
    }

    static createTea(tea) {
        return $.post(this.url, tea);
    }

    static updateTea(tea) {
        console.log("is this tea working", Tea);
        return $.ajax({
            url: this.url + `/${tea.id}`,
            dataType: 'json',
            data: JSON.stringify(tea),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteTea(id) {
        console.log('testing the delete', Tea);
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
 static teas;

    static getAllTeas() {
    TeaService.getAllTeas().then(teas => this.render(teas));
 }

    static createTea(name) {
    TeaService.createTea(new Tea(name))
    .then(() => {
        return TeaService.getAllTeas();
    })
    .then((teas) => {
        console.log('this is create tea method', teas);
        this.render(teas)
    });
}

    static updateTea(name){
    TeaService.updateTea(new Tea(name))
    .then(() => {
        console.log('this updated the tea name', tea);
    });
    }

    static deleteTea(id) {
    TeaService.deleteTea(id)
    .then(() => {
        return TeaService.getAllTeas();
    })
    .then((teas) => {
        //console.log(teas);
        this.render(teas)
    }); 
}

    static addFlavor(id) {
    for (let tea of this.teas) {
        if (tea._id == id) {
            tea.flavors.push(new Flavor($(`#${tea._id}-flavor-name`).val(), $(`#${tea._id}-flavor-topping`).val()));
            TeaService.updateTea(tea) 
                .then(() => {
                    return TeaService.getAllTeas();
                }) 
                .then((teas) => {
                    console.log('adding flavor', tea);
                    this.render(teas)
                });
            }
        }
    }

    static deleteFlavor(teaId, flavorId) {
        for (let tea of this.teas) {
            if (tea._id == teaId) {
                for (let flavor of tea.flavors) {
                    if (flavor._id == flavorId) {
                        tea.flavors.splice(tea.flavors.indexOf(flavor), 1);
                        TeaService.updateTea(tea)
                        .then(() => {
                            return TeaService.getAllTeas();
                        })
                        .then((teas) => this.render(teas));
                    }
                }
            }
        }
    }

    static render(teas) {
        console.log('what is teas doing here', teas);
        this.teas = teas;
        $('#app').empty();
        for (let tea of teas) { //this loops thru the array of teas and each element is called tea
            console.log('tea', tea);

            $('#app').prepend(
            `<div id="${tea.id}" class="card">
                <div class="card-header">
                    <h2>${tea.name}</h2>
                    <div class="col-sm">
                                <input type ="text" id="${tea.id}-tea-name" class ="form-control" placeholder="Updated Tea Name">
                            </div>
                    <button class="btn btn-secondary" onclick="DOMManager.updateTea('${tea.id}')">Update</button>
                    <button class="btn btn-danger" onclick="DOMManager.deleteTea('${tea.id}')">Delete</button> 
                </div>
                <div class="card-body">
                    <div class="card">
                        <div class="row">
                                <div class="col-sm">
                                    <input type ="text" id="${tea.id}-flavor-name" class ="form-control" placeholder="Flavor Name">
                                </div>
                                
                            <div class="col-sm">
                                <input type ="text" id="${tea.id}-flavor-topping" class ="form-control" placeholder="Flavor Topping">
                            </div>
                        </div>
                        <button id="${tea.id}-new-flavor" onclick="DOMManager.addFlavor('${tea.id}')" class="btn btn-primary form-control">Add</button>
                    </div>
                </div>
            </div><br>`
         );
         for (let flavor of tea.flavor) {
            console.log("is this defined", flavor);
           $(`#${tea._id}`).find('.card-body').append(
                `
                <p>
                <span id="name-${flavor._id}"><strong>Name: </strong> ${flavor.name}</span>
                <span id="name-${flavor._id}"><strong>Topping: </strong> ${flavor.topping}</span>
                <button class="btn btn-danger" onclick="DOMManager.deleteFlavor('${tea.id}','${flavor._id}')">Delete Flavor</button>
                </p>
                `
            )
         }
    }
 }
}

$('#create-new-tea').on(() => {
    DOMManager.createTea($('#new-tea-name').val());
    $('#new-tea-name').val('');
});

DOMManager.getAllTeas();