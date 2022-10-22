class Tea {
    constructor(name){
        this.name = name;
        this.flavors = [];
    }

    addFlavor(name, ounce) {
        //console.log('adding ounces here', ounce);
        this.flavors.push(new Flavor(name, ounce));
    }
}

class Flavor {
    constructor(name, ounce){
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
            url: this.url + `/${tea._id}`,
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
    .then((teas) => {
        //console.log('this is create tea method', teas);
        this.render(teas)
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
            tea.flavors.push(new Flavor($(`#${tea._id}-flavor-name`).val(), $(`#${tea._id}-flavor-ounce`).val()));
            TeaService.updateTea(tea) 
                .then(() => {
                    return TeaService.getAllTeas();
                }) 
                .then((teas) => {
                    //console.log('adding flavor', tea);
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
        //console.log('what is teas doing here', teas);
        this.teas = teas;
        $('#app').empty();
        for (let tea of teas) { //this loops thru the array of teas and each element is called tea
            console.log('tea', teas);
            //create html for div and btn's. if i make the div id on line 125 tea._id the delete flavor button appears and the flavor name / ounces become undefined
            $('#app').prepend(
            `<div id="${tea._id}" class="card"> 
                <div class="card-header">
                    <h2>${tea.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteTea('${tea._id}')">Delete</button> 
                    </div>
                <div class="card-body">
                    <div class="card">
                        <div class="row">
                            <div class="col-sm">
                                <input type ="text" id="${tea._id}-flavor-name" class ="form-control" placeholder="Flavor Name">
                            </div>
                                
                            <div class="col-sm">
                                <input type ="text" id="${tea._id}-flavor-ounce" class ="form-control" placeholder="Ounces">
                            </div>
                        </div>
                        <button id="${tea._id}-new-flavor" onclick="DOMManager.addFlavor('${tea._id}')" class="btn btn-primary form-control">Add</button>
                    </div>
                </div>
            </div><br>`
         );
         for (let flavor of tea.flavors) {
            //console.log("is this defined", flavor);
           $(`#${tea._id}`).find('.card-body').append(
                `<p>
                <span id="name-${flavor._id}"><strong>Name: </strong> ${flavor.name}</span>
                <span id="name-${flavor._id}"><strong>Ounce: </strong> ${flavor.ounce}</span>
                <button class="btn btn-danger" onclick="DOMManager.deleteFlavor('${tea._id}','${flavor._id}')">Delete Flavor</button>
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