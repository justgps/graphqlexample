const Express = require("express");
const ExpressGraphQL = require("express-graphql");
const GraphQLObjectType = require("graphql").GraphQLObjectType;
const GraphQLID = require("graphql").GraphQLID;
const GraphQLString = require("graphql").GraphQLString;
const GraphQLList = require("graphql").GraphQLList;
const GraphQLSchema = require("graphql").GraphQLSchema;

var app = Express();

const mockAlbums = [
    {
        "id": "1",
        "title": "無人熟識",
        "artist": "張清芳"
    },
    {
        "id": "2",
        "title": "深深太平洋",
        "artist": "任賢齊"
    }
];

const mockSongs = [
    {
        "id": "1",
        "album": "1",
        "title": "他們的故事"
    },
    {
        "id": "2",
        "album": "2",
        "title": "心太軟"
    }
];

const AlbumType = new GraphQLObjectType({
    name: "Album",
    fields: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        artist: { type: GraphQLString }
    }
});

const SongType = new GraphQLObjectType({
    name: "Song",
    fields: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        album: {
            type: AlbumType,
            resolve: (root, args, context, info) => {
                var album = mockAlbums.find(mockAlbum => mockAlbum.id == root.album);
                return album;
            }
        }
    }
});

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            songs: {
                type: GraphQLList(SongType),
                resolve: (root, args, context, info) => {
                    return mockSongs;
                }
            },
            albums: {
                type: GraphQLList(AlbumType),
                resolve: (root, args, context, info) => {
                    return mockAlbums;
                }
            }
        }
    })
});

app.use("/graphql", ExpressGraphQL({
    schema: schema,
    graphiql: true
}));

app.listen(3080, () => {
    console.log("Listening at :10080/notify/graphql");
});
