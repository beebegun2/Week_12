class Tea { //class creates the object Tea
    constructor(name){
        this.name = name;
        this.flavors = [];
    }

    addFlavor(name, ounce) { //this adds a new flavor and ounce 
        //console.log('adding ounces here', ounce);
        this.flavors.push(new Flavor(name, ounce));
    }
}

class Flavor { //class creates the flavor
    constructor(name, ounce){  //name = name of tea, ounce = size
        //console.log('this is the class of flavor and ounce', Flavor);
        this.name = name;
        this.ounce = ounce;
    }
}

//link api 
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
        return $.ajax({
            url: this.url + `/${tea.id}`,
            dataType: 'json',
            data: JSON.stringify(tea),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteTea(id) {
        //console.log('testing the delete', Tea);
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
    .then((teas) => 
        //console.log('this is create tea method', teas);
        this.render(teas));
}

    static deleteTea(id) {
    TeaService.deleteTea(id)
    .then(() => {
        return TeaService.getAllTeas();
    })
    .then((teas) =>
        //console.log(teas);
        this.render(teas)); 
}

    static addFlavor(id) {
    for (let tea of this.teas) {
        if (tea.id == id) {
            tea.flavors.push(new Flavor($(`#${tea.id}-flavor-name`).val(), $(`#${tea.id}-flavor-ounce`).val()));
            TeaService.updateTea(tea) 
                .then(() => {
                    return TeaService.getAllTeas();
                }) 
                .then((teas) =>
                    //console.log('adding flavor', tea);
                    this.render(teas));
            }
        }
    }

    static deleteFlavor(teaId, flavorName) {
        for (let tea of this.teas) {
            if (tea.id == teaId) {
                for (let flavor of tea.flavors) {
                    if (flavor.name == flavorName) {
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
        //console.log('what is teas doing here', teas);
        this.teas = teas
        $('#app').empty();
        for (let tea of teas) { //this loops thru the array of teas and each element is called tea
            //console.log('tea', teas);
            //create html for div and btn's.
            $('#app').prepend(
            `<div id="${tea.id}" class="card"> 
                <div class="card-header">
                    <h2>${tea.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteTea('${tea.id}')">Delete</button> 
                </div>
                <div class="card-body">
                    <div class="card">
                        <div class="row">
                            <div class="col-sm">
                                <input type ="text" id="${tea.id}-flavor-name" class ="form-control"  background="transparent" placeholder="Flavor Name">
                            </div>
                                
                            <div class="col-sm">
                                <input type ="text" id="${tea.id}-flavor-ounce" class ="form-control" background="transparent" placeholder="Ounces">
                            </div>
                        </div>
                        <button id="${tea.id}-new-flavor" onclick="DOMManager.addFlavor('${tea.id}')" class="btn btn-secondary form-control">Add</button>
                    </div>
                </div>
            </div> <br>`
         );
         for (let flavor of tea.flavors) {
            //console.log("is this defined", flavor);
           $(`#${tea.id}`).find('.card-body').append(
                `<p>
                <span id="name-${flavor.name}"><strong>Name: </strong> ${flavor.name}</span>
                <span id="name-${flavor.name}"><strong>Ounce: </strong> ${flavor.ounce}</span>
                <button class="btn btn-danger" onclick="DOMManager.deleteFlavor('${tea.id}','${flavor.name}')">Delete Flavor</button>
                </p>
                `
            )
         }
    }
 }
}

$('#create-new-tea').click(() => {
    DOMManager.createTea($('#new-tea-name').val());
    $('#new-tea-name').val('');
});

DOMManager.getAllTeas();