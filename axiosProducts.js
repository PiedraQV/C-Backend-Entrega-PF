const axios = require('axios')
const mocha = require('mocha')
const expect = require('chai').expect

describe('CRUD de productos', ()=>{

    it('/productos post should show product to DB', async function(){

        const data = JSON.stringify({
            "collection": "products",
            "database": "test",
            "dataSource": "Cluster0",
            "projection": {
                "_id": 1,
                "imagePath": 1,
                "title": 1,
                "description": 1,
                "price": 1,
            },
        });
        
        
        const config = {
            method: 'post',
            url: 'https://data.mongodb-api.com/app/data-eixer/endpoint/data/v1/action/findOne',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Request-Headers': '*',
              'api-key': 'GR9ZPPJOjmsPsxEiikL4GRydWb6pRHm6JzZoKVgovwNT2Crd57S6kBjS0R5xSZt6',
            },
            data: data
        };
        
        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    }
        
    )



    it('/update post should insert one product to DB', async function(){

        const dataInsert = JSON.stringify({
            "collection": "products",
            "database": "test",
            "dataSource": "Cluster0",
            "document": {
               "imagePath": "https://media.gq-magazine.co.uk/photos/621cbc0f73021b051fcbc729/master/w_1920,h_1280,c_limit/24022022_A_13.jpeg",
                "title": "Nike´s shoes",
                "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
                "price": "65"
            },
        });
        const configInsert = {
            method: 'post',
            url: 'https://data.mongodb-api.com/app/data-eixer/endpoint/data/v1/action/insertOne',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Request-Headers': '*',
              'api-key': 'GR9ZPPJOjmsPsxEiikL4GRydWb6pRHm6JzZoKVgovwNT2Crd57S6kBjS0R5xSZt6',
            },
            data: dataInsert
        };
        axios(configInsert)
        .then(function (response) {
            console.log(JSON.stringify(response.dataInsert));
        })
        .catch(function (error) {
            console.log(error);
        });
        
        
})

    it('delete should remove last product to DB', async function(){

        const dataDelete = JSON.stringify({
            "collection": "products",
            "database": "test",
            "dataSource": "Cluster0",
            "filter": { "_id": { "$oid": "63d1bf8498fa9d2760f948a1" }}
        });
        
        const configDelete = {
            method: 'post',
            url: 'https://data.mongodb-api.com/app/data-eixer/endpoint/data/v1/action/deleteOne',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Request-Headers': '*',
              'api-key': 'GR9ZPPJOjmsPsxEiikL4GRydWb6pRHm6JzZoKVgovwNT2Crd57S6kBjS0R5xSZt6',
            },
            data: dataDelete
        };
                   
        axios(configDelete)
        .then(function (response) {
            console.log(JSON.stringify(response.dataDelete));
        })
        .catch(function (error) {
            console.log(error);
        });
        
        
    })

})
