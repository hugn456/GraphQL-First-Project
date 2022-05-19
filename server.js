const express =require("express")
const expressGraphQL=require("express-graphql").graphqlHTTP
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require("graphql")
const { argsToArgsConfig } = require("graphql/type/definition")
const app= express()

// client examples
const clients =[
    { id: 1, name: "Ronaldo"},
    { id: 2, name: "Pogba"},
    { id: 3, name: "Balloteli"},
    { id: 4, name: "Messi"},
    { id: 5, name: "Ronaldinho"},
    { id: 6, name: "Kaka"},
    { id: 7, name: "Mourinho"}
]
// logistics service examples
const logisticsServices = [
    { id: 1, name: "customerServiceOrdering", clientId: 1},
    { id: 2, name: "shipmentPlanning", clientId: 2},
    { id: 3, name: "transportation", clientId: 2},
    { id: 4, name: "warehousing", clientId: 3},
    { id: 5, name: "physicalInventoryControl", clientId: 1},
    { id: 6, name: "packagingAndUnitization", clientId: 2},
    { id: 7, name: "reverseLogistics", clientId: 7}
]

// create root query 
const RootQueryType= new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () =>({

        // clients field
        clients: {
            type: new GraphQLList(ClientType),
            description: "List of all clients",
            resolve: () => clients
        },

        // client field, find the information of a client based on his id
        client: {
            type: ClientType,
            description: "a single client",
            args: {id: {type: new GraphQLNonNull(GraphQLInt)}},
            resolve: (parent,args) =>{
                return clients.find(client=>client.id=== args.id);
            }
        },

        // logistics services field
        logisticsServices: {
            type: new GraphQLList(LogisticsServicesType),
            description: "List of all logistics services",
            resolve: () => logisticsServices

        },

        // logistics service field, find the information of a logistic service based on its id
        logisticsService: {
            type: LogisticsServicesType,
            description: "a single logistic service",
            args: {id: {type: new GraphQLNonNull(GraphQLInt)} },
            resolve: (parent,args) => {
                return logisticsServices.find(logisticsService =>logisticsService.id === args.id )
            }
        }
    })
})
// create client type
const ClientType= new GraphQLObjectType({
    name: "client",
    description: "This represent a client of a logistics service",
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        // add another field called logisticsServices into clients
        logisticsServices: {
            type: new GraphQLList(LogisticsServicesType),
            resolve: (parent) =>{
                return logisticsServices.filter(logisticsService => logisticsService.clientId === parent.id)
            }
        }
    })
})

// create logistics service type
const LogisticsServicesType= new GraphQLObjectType ({
    name: "logisticsService",
    description: "This represent a logistics service of a client",
    fields: ()=>({
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        clientId: {type: new GraphQLNonNull(GraphQLInt)},
        // add another field named client into logisticsServices
        client: {
            type: ClientType,
            resolve: (parent) =>{
                return clients.find(client => client.id === parent.clientId)
            }
        }
    
        })
    })

const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () =>({

        // add a logicstic service in to logisticsServices, ex: addLogisticsService(name:"ABC", clientId:"1")
        addLogisticsService: {
            type: LogisticsServicesType,
            description: "Add a logistic service",
            args: {
                name: { type: new GraphQLNonNull(GraphQLString)},
                clientId: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                const logisticsService = {id: logisticsServices.length +1, name: args.name, clientId: args.clientId};
                logisticsServices.push(logisticsService);
                return logisticsService;}
            },
        
        // add a client into clients, ex: addClient(name:"ABC")
        addClient:{
            type: ClientType,
            description: "Add a client",
            args: {
                name: { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args) =>{
                const client = {id: clients.length+1, name: args.name};
                clients.push(client);
                return client;
            }
        },

        // get rid of a client from clients and all his information from logisticsServices, ex: deleteClient(name:"ABC")
        deleteClient:{
            type: ClientType,
            description: "Delete a client",
            args:{
        
                name: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args) => {
                for (var i=clients.length-1; i>-1; i--){
                    if ( clients[i].name=== args.name ) {
                        for (var j=logisticsServices.length-1; j>-1;j--){
                            if (clients[i].id===logisticsServices[j].clientId)
                                logisticsServices.splice(j,1);
                        }    
                        clients.splice(i,1);}
                }
                return args;
            }},
            
        // delete a logistic service from logisticsServices, ex: deleteLogisticsService(name: "A") 
        deleteLogisticsService:{
            type: LogisticsServicesType,
            description: "Delete a logistic service",
            args:{
                name: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args) =>{
                for (var i=logisticsServices.length-1; i>-1; i--){
                    if (logisticsServices[i].name=== args.name ) 
                        logisticsServices.splice(i,1);
                }                
                return args;
            }
        }
        
        })
    })

// create schema
const schema= new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

// use localhost:5000/graphql
app.use("/graphql",expressGraphQL({
    schema: schema,
    graphiql: true
}))
// set up local host 5000 
app.listen(5000.,() => console.log("Server Running") )