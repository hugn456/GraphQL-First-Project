# Server Activation
1)npm install

2)npm install express express-graphql graphql

3)node server.js
# Details
Activating localhost:5000

We would like to analyze a client list including id and name; and a logistic service list including id, name and clientId: 

clients =[

    { id: 1, name: "Ronaldo"},
    
    { id: 2, name: "Pogba"},
    
    { id: 3, name: "Balloteli"},
    
    { id: 4, name: "Messi"},
    
    { id: 5, name: "Ronaldinho"},
    
    { id: 6, name: "Kaka"},
    
    { id: 7, name: "Mourinho"}
    
]

logisticsServices = [

    { id: 1, name: "customerServiceOrdering", clientId: 1},
    
    { id: 2, name: "shipmentPlanning", clientId: 2},
    
    { id: 3, name: "transportation", clientId: 2},
    
    { id: 4, name: "warehousing", clientId: 3},
    
    { id: 5, name: "physicalInventoryControl", clientId: 1},
    
    { id: 6, name: "packagingAndUnitization", clientId: 2},
    
    { id: 7, name: "reverseLogistics", clientId: 7}
    
]
# Basic Functions In http://localhost:5000/graphql
1) Find all the information about clients or logisctics services
+ query{clients{ id name}}
+ query{clients{ id name logisticsServices{ id name clientId}}
+ query{logisticsServices{ id name clientId}
+ query{logisticsServices{id name clientId client {id name }}

2) Find all the information about a client or a logistic service
+ query{ client(id:1){name}}
+ query{logisticsService(id:1){name clientId}}

3) Delete or add a client or logistics service
+ mutation{ addClient(name:"ABC"){name}}
+ mutation {addLogisticService(name:"A", clientId:"1"){name}}
+ mutation{deleteClient(name:"ABC"){name}}
+ mutation{deleteLogisticsService(name:"a"){name}}
