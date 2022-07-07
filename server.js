let express = require ('express');
const { 
    
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
 } = require('graphql');
let app = express();
let expressGraphQL = require('express-graphql')


const BookType = new GraphQLObjectType({
    name : "BookType",
    description:"Book type",
    fields: () =>({
        id:{type: new GraphQLNonNull( GraphQLInt) },
        name:{type: new GraphQLNonNull( GraphQLString) },
        authorId:{type: new GraphQLNonNull( GraphQLInt) },
        author: {type: AuthorType, resolve:(book)=> authors.find(author=>author.id === book.authorId)}
    })
})

const AuthorType = new GraphQLObjectType({
    name: "AuthorType",
    description:"Author type",
    fields:() => ({
        name:{type: new GraphQLNonNull(GraphQLString)},
        id:{type: new GraphQLNonNull( GraphQLInt) },
        books: {type: new GraphQLList(BookType), resolve:(author)=> books.filter(book=>book.authorId === author.id)}
    })

})

const RootQueryType= new GraphQLObjectType({
    name: 'Query',
    description:"Root Query",
    fields:() => ({

        books: {
            type: new GraphQLList( BookType),
            description:"list of books",
            resolve:() => books,
        },
        authors: {
            type: new GraphQLList( AuthorType),
            description:"list of Authors",
            resolve:() => authors,
        },
        book: {
            type:  BookType,
            description:"Book by id ",
            args:{ id: {type: GraphQLInt} },
            resolve:(parentn, args) => books.find(book=> book.id===args.id) 
        },
        author: {
            type:  AuthorType,
            description:"Author by id ",
            args:{ id: {type: GraphQLInt} },
            resolve:(parentn, args) => authors.find(author=> author.id===args.id) 
        },
    })
})

const RootMutationType = new GraphQLObjectType({
    name: "RootMutationType",
    description: "Mutation object type",
    fields:() =>({

        addBook: {
            type: new GraphQLList( BookType),
            name:"AddBook",
            description:"Add a book",
            args: {
                id: {type:GraphQLInt },
                name: {type: GraphQLString},
                authorId: {type:GraphQLInt },
            },
            resolve: (parent, args)=> {
                books.push({id:args.id, name:args.name, authorId:args.authorId})
                return books
            },   
            
        },

        deleteBook: {
            type: new GraphQLList( BookType),
            name:"DeleteBook",
            description:"Delete a book",
            args: {
                id: {type:GraphQLInt },
            },
            resolve: (parent, args)=> {
                console.log("args ",args.id)

                let index = books.findIndex(book => book.id === args.id);
                console.log(index)
                books.splice(index,1);
                return books
            },   
            
        }

    })

})



const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
})

app.listen(5000, ()=>{
    console.log("server up")
})

console.log(expressGraphQL.graphqlHTTP)
app.use('/graphql' , expressGraphQL.graphqlHTTP({
    graphiql:true,
    schema: schema

})) 




let authors = [
    {id:1, name: "JK rollings"},
    {id:2, name: "Amos Oz"},
    {id:3, name: "Reem Halevi"},
]

let books = [
    {id:1, name: "Harry Potter 1",  authorId:1},
    {id:2, name: "Harry Potter 2",  authorId:1},
    {id:3, name: "Harry Potter 3",  authorId:1},
    {id:4, name: "Balck box",  authorId:2},
    {id:5, name: "Ahava and darkness",  authorId:2},
    {id:6, name: "No Book",  authorId:3},
]