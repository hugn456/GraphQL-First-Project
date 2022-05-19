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

const clients =[
    { id: 1, name: "Ronaldo"},
    { id: 2, name: "Pogba"},
    { id: 3, name: "Balloteli"},
    { id: 4, name: "Messi"},
    { id: 5, name: "Ronaldinho"},
    { id: 6, name: "Kaka"},
    { id: 7, name: "Mourinho"}
]
const logisticsServices = [
    { id: 1, name: "customerServiceOrdering", clientId: 1},
    { id: 2, name: "shipmentPlanning", clientId: 2},
    { id: 3, name: "transportation", clientId: 2},
    { id: 4, name: "warehousing", clientId: 3},
    { id: 5, name: "physicalInventoryControl", clientId: 1},
    { id: 6, name: "packagingAndUnitization", clientId: 2},
    { id: 7, name: "reverseLogistics", clientId: 7}
]

const RootQueryType= new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () =>({
        clients: {
            type: new GraphQLList(ClientType),
            description: "List of all clients",
            resolve: () => clients
        },

        client: {
            type: ClientType,
            description: "a single client",
            args: {id: {type: new GraphQLNonNull(GraphQLInt)}},
            resolve: (parent,args) =>{
                return clients.find(client=>client.id=== args.id);
            }
        },

        logisticsServices: {
            type: new GraphQLList(LogisticsServicesType),
            description: "List of all logistics services",
            resolve: () => logisticsServices

        },

        logisticService: {
            type: LogisticsServicesType,
            description: "a single logistic service",
            args: {id: {type: new GraphQLNonNull(GraphQLInt)} },
            resolve: (parent,args) => {
                return logisticsServices.find(logisticService =>logisticService.id === args.id )
            }
        }
    })
})

const ClientType= new GraphQLObjectType({
    name: "client",
    description: "This represent a client of a logistics service",
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        logisticsServices: {
            type: new GraphQLList(LogisticsServicesType),
            resolve: (parent) =>{
                return logisticsServices.filter(logisticsService => logisticsService.clientId === parent.id)
            }
        }
    })
})

const LogisticsServicesType= new GraphQLObjectType ({
    name: "logisticService",
    description: "This represent a logistics service of a client",
    fields: ()=>({
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        clientId: {type: new GraphQLNonNull(GraphQLInt)},
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

        addLogisticService: {
            type: LogisticsServicesType,
            description: "Add a logistic service",
            args: {
                name: { type: new GraphQLNonNull(GraphQLString)},
                clientId: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                const logisticService = {id: logisticsServices.length +1, name: args.name, clientId: args.clientId};
                logisticsServices.push(logisticService);
                return logisticService;}
            },

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

const schema= new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use("/graphql",expressGraphQL({
    schema: schema,
    graphiql: true
}))
app.listen(5000.,() => console.log("Server Running") )