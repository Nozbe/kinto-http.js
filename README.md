kinto-client
============

[![Build Status](https://travis-ci.org/Kinto/kinto-client.svg?branch=master)](https://travis-ci.org/Kinto/kinto-client)

A JavaScript HTTP Client for the [Kinto](http://kinto-storage.org/) API.

Read the [API documentation](https://doc.esdoc.org/github.com/Kinto/kinto-client/).

Public CDN files:

- [kinto-client.js](https://npmcdn.com/kinto-client/dist/kinto-client.js)
- [kinto-client.min.js](https://npmcdn.com/kinto-client/dist/kinto-client.min.js)
- [kinto-client.noshim.js](https://npmcdn.com/kinto-client/dist/kinto-client.noshim.js)

## Usage

A client instance is created using the `KintoClient` constructor, passing it the remote Kinto server URL:

```js
const client = new KintoClient("https://kinto.dev.mozaws.net/v1/");
```

## Buckets

### Listing buckets

```js
client.getBuckets();
```

Sample result:

```js
[
  {
    id: "comments",
    last_modified: 1456182233221,
  },
  {
    id: "blog",
    last_modified: 1456181213214,
  },
]
```

### Creating a new bucket

```js
client.createBucket("blog");
```

Sample result:

```js
{
  "data": {
    "last_modified": 1456182233221,
    "id": "foo"
  },
  "permissions": {
    "write": [
      "basicauth:0f7c1b72cdc89b9d42a2d48d5f0b291a1e8afd408cc38a2197cdf508269cecc8"
    ]
  }
}
```

### Selecting a bucket

```js
client.bucket("blog");
```

### Getting bucket permissions

```js
client.bucket("blog").getPermissions();
```

Sample result:

```js
{
  "write": [
    "basicauth:0f7c1b72cdc89b9d42a2d48d5f0b291a1e8afd408cc38a2197cdf508269cecc8"
  ]
}
```

### Setting bucket permissions

#### Write permissions

```js
client.bucket("blog").setPermissions("write", ["github:john", "github:bob"]);
```

Sample result:

```js
{
  "data": {
    "last_modified": 1456182888466,
    "id": "blog"
  },
  "permissions": {
    "write": [
      "github:bob",
      "basicauth:0f7c1b72cdc89b9d42a2d48d5f0b291a1e8afd408cc38a2197cdf508269cecc8",
      "github:john"
    ]
  }
}
```

#### Read permissions

```js
client.bucket("blog").setPermissions("read", ["github:john", "github:bob"]);
```

Sample result:

```js
{
  "data": {
    "last_modified": 1456182791199,
    "id": "blog"
  },
  "permissions": {
    "write": [
      "basicauth:0f7c1b72cdc89b9d42a2d48d5f0b291a1e8afd408cc38a2197cdf508269cecc8"
    ],
    "read": [
      "github:bob",
      "github:john"
    ]
  }
}
```

### Deleting a bucket

```js
client.deleteBucket("testbucket");
```

Sample result:

```js
{
  "data": {
    "deleted": true,
    "last_modified": 1456182931974,
    "id": "blog"
  }
}
```

### Creating a collection

#### Named collection

```js
client.bucket("blog").createCollection("posts");
```

Sample result:

```js

{
  "data": {
    "last_modified": 1456183004372,
    "id": "posts"
  },
  "permissions": {
    "write": [
      "basicauth:0f7c1b72cdc89b9d42a2d48d5f0b291a1e8afd408cc38a2197cdf508269cecc8"
    ]
  }
}
```

#### With a name generated automatically

```js
client.bucket("blog").createCollection();
```

Sample result:

```js
{
  "data": {
    "last_modified": 1456183040592,
    "id": "OUh5VEDa"
  },
  "permissions": {
    "write": [
      "basicauth:0f7c1b72cdc89b9d42a2d48d5f0b291a1e8afd408cc38a2197cdf508269cecc8"
    ]
  }
}
```

Note that `OUh5VEDa` is the collection id automatically generated by the server.

### Listing bucket collections

```js
client.bucket("blog").getCollections();
```

Sample result:

```js
[
  {
    "last_modified": 1456183153840,
    "id": "posts"
  },
  {
    "last_modified": 1456183159386,
    "id": "comments"
  }
]
```

### Deleting a collection

```js
client.bucket("blog").deleteCollection("test");
```

Sample result:

```js
{
  "data": {
    "deleted": true,
    "last_modified": 1456183116571,
    "id": "posts"
  }
}
```

## Collections

### Selecting a collection

```js
client.bucket("blog").collection("posts");
```

### Setting the [JSON schema](http://json-schema.org/) for a collection

```js
const schema = {
  type: "object",
  required: ["title", "content"],
  properties: {
    title: {type: "string"},
    content: {type: "string"}
  }
};

client.bucket("blog").collection("posts").setSchema(schema);
```

Sample result:

```js
{
  "data": {
    "last_modified": 1456183376428,
    "id": "posts",
    "schema": {
      "required": [
        "title",
        "content"
      ],
      "type": "object",
      "properties": {
        "content": {
          "type": "string"
        },
        "title": {
          "type": "string"
        }
      }
    }
  },
  "permissions": {
    "write": [
      "basicauth:0f7c1b72cdc89b9d42a2d48d5f0b291a1e8afd408cc38a2197cdf508269cecc8"
    ]
  }
}
```

### Retrieving collection schema

```js
client.bucket("blog").collection("posts").getSchema();
```

Sample result:

```js
{
  "required": [
    "title",
    "content"
  ],
  "type": "object",
  "properties": {
    "content": {
      "type": "string"
    },
    "title": {
      "type": "string"
    }
  }
}
```

### Setting collection permissions

#### Write permissions

```js
client.bucket("blog").collection("posts")
  .setPermissions("write", ["github:john", "github:bob"]);
```

Sample result:

```js
{
  "data": {
    "last_modified": 1456183508926,
    "id": "posts"
  },
  "permissions": {
    "write": [
      "github:bob",
      "basicauth:0f7c1b72cdc89b9d42a2d48d5f0b291a1e8afd408cc38a2197cdf508269cecc8",
      "github:john"
    ]
  }
}
```

#### Read permissions

```js
client.bucket("blog").collection("posts")
  .setPermissions("read", ["github:john", "github:bob"]);
```

Sample result:

```js
{
  "data": {
    "last_modified": 1456183479264,
    "id": "posts"
  },
  "permissions": {
    "read": [
      "github:bob",
      "github:john"
    ],
    "write": [
      "basicauth:0f7c1b72cdc89b9d42a2d48d5f0b291a1e8afd408cc38a2197cdf508269cecc8"
    ]
  }
}
```

### Setting collection metadata

```js
client.bucket("blog").collection("posts")
  .setMetas({preferedAuthor: "@chucknorris"});
```

Sample result:

```js
{
  "data": {
    "last_modified": 1456183561206,
    "id": "posts",
    "preferedAuthor": "@chucknorris"
  },
  "permissions": {
    "write": [
      "github:bob",
      "basicauth:0f7c1b72cdc89b9d42a2d48d5f0b291a1e8afd408cc38a2197cdf508269cecc8",
      "github:john"
    ]
  }
}
```

### Getting collection metadata

```js
client.bucket("blog").collection("posts").getMetas();
```

Sample result:

```js
{
  "last_modified": 1456183561206,
  "id": "posts",
  "preferedAuthor": "@chucknorris"
}
```

### Creating a new record

```js
client.bucket("blog").collection("posts")
  .createRecord({title: "My first post", content: "Hello World!"});
```

Sample result:

```js
{
  "data": {
    "content": "Hello World!",
    "last_modified": 1456183657846,
    "id": "cb0f7b2b-e78f-41a8-afad-92a56f8c88db",
    "title": "My first post"
  },
  "permissions": {
    "write": [
      "basicauth:0f7c1b72cdc89b9d42a2d48d5f0b291a1e8afd408cc38a2197cdf508269cecc8"
    ]
  }
}
```

### Retrieving an existing record

```js
client.bucket("blog").collection("posts")
  .getRecord("cb0f7b2b-e78f-41a8-afad-92a56f8c88db");
```

Sample result:

```js
{
  "data": {
    "content": "Hello World!",
    "last_modified": 1456183657846,
    "id": "cb0f7b2b-e78f-41a8-afad-92a56f8c88db",
    "title": "My first post"
  },
  "permissions": {
    "write": [
      "basicauth:0f7c1b72cdc89b9d42a2d48d5f0b291a1e8afd408cc38a2197cdf508269cecc8"
    ]
  }
}
```

### Updating an existing record

```js
client.bucket("blog").collection("posts")
  .updateRecord({id: "cb0f7b2b-e78f-41a8-afad-92a56f8c88db", title: "My first post, edited", content: "Hello World, again!"});
```

Sample result:

```js
{
  "data": {
    "content": "Hello World, again!",
    "last_modified": 1456183778891,
    "id": "cb0f7b2b-e78f-41a8-afad-92a56f8c88db",
    "title": "My first post, edited"
  },
  "permissions": {
    "write": [
      "basicauth:0f7c1b72cdc89b9d42a2d48d5f0b291a1e8afd408cc38a2197cdf508269cecc8"
    ]
  }
}
```

### Deleting record

```js
client.bucket("blog").collection("posts")
  .deleteRecord("cb0f7b2b-e78f-41a8-afad-92a56f8c88db");
```

Sample result:

```js
{
  "data": {
    "deleted": true,
    "last_modified": 1456183877287,
    "id": "cb0f7b2b-e78f-41a8-afad-92a56f8c88db"
  }
}
```

### Listing records

```js
client.bucket("blog").collection("posts")
  .getRecords();
```

Sample result:

```js
[
  {
    "content": "True.",
    "last_modified": 1456183930780,
    "id": "a89dd4b2-d597-4192-bc2b-834116244d29",
    "title": "I love cheese"
  },
  {
    "content": "Yo",
    "last_modified": 1456183914275,
    "id": "63c1805a-565a-46cc-bfb3-007dfad54065",
    "title": "Another post"
  }
]

```

### Batching operations

This allows performing multiple operations in a single HTTP request.

```js
client.bucket("blog").collection("posts")
  .batch(batch => {
    batch.deleteRecord("cb0f7b2b-e78f-41a8-afad-92a56f8c88db");
    batch.createRecord({title: "new post", content: "yo"});
    batch.createRecord({title: "another", content: "yo again"});
  });
```

Sample result:

```js
[
  {
    "status": 200,
    "path": "/v1/buckets/blog/collections/posts/records/a89dd4b2-d597-4192-bc2b-834116244d29",
    "body": {
      "data": {
        "deleted": true,
        "last_modified": 1456184078090,
        "id": "a89dd4b2-d597-4192-bc2b-834116244d29"
      }
    },
    "headers": {
      "Content-Length": "99",
      "Content-Type": "application/json; charset=UTF-8",
      "Access-Control-Expose-Headers": "Retry-After, Content-Length, Alert, Backoff"
    }
  },
  {
    "status": 201,
    "path": "/v1/buckets/blog/collections/posts/records",
    "body": {
      "data": {
        "content": "yo",
        "last_modified": 1456184078096,
        "id": "afd650b3-1625-42f6-8994-860e52d39201",
        "title": "new post"
      },
      "permissions": {
        "write": [
          "basicauth:0f7c1b72cdc89b9d42a2d48d5f0b291a1e8afd408cc38a2197cdf508269cecc8"
        ]
      }
    },
    "headers": {
      "Content-Length": "221",
      "Content-Type": "application/json; charset=UTF-8",
      "Access-Control-Expose-Headers": "Retry-After, Content-Length, Alert, Backoff"
    }
  },
  {
    "status": 201,
    "path": "/v1/buckets/blog/collections/posts/records",
    "body": {
      "data": {
        "content": "yo again",
        "last_modified": 1456184078102,
        "id": "22c1319e-7b09-46db-bec4-c240bdf4e3e9",
        "title": "another"
      },
      "permissions": {
        "write": [
          "basicauth:0f7c1b72cdc89b9d42a2d48d5f0b291a1e8afd408cc38a2197cdf508269cecc8"
        ]
      }
    },
    "headers": {
      "Content-Length": "226",
      "Content-Type": "application/json; charset=UTF-8",
      "Access-Control-Expose-Headers": "Retry-After, Content-Length, Alert, Backoff"
    }
  }
]
```

This is a rather long result. You'll be happy to learn that there's an `aggregate` option summarizing the results:

```js
client.bucket("blog").collection("posts")
  .batch(batch => {
    batch.createRecord({title: "new post", content: "yo"});
    batch.createRecord({title: "another", content: "yo again"});
  }, {aggregate: true});
```

Sample result:

```js
{
  "errors": [],
  "published": [
    {
      "data": {
        "content": "yo",
        "last_modified": 1456184189160,
        "id": "fbd2a565-8c10-497a-95b8-ce4ea6f474e1",
        "title": "new post"
      },
      "permissions": {
        "write": [
          "basicauth:0f7c1b72cdc89b9d42a2d48d5f0b291a1e8afd408cc38a2197cdf508269cecc8"
        ]
      }
    },
    {
      "data": {
        "content": "yo again",
        "last_modified": 1456184189166,
        "id": "ed2bff0e-11f9-455b-8c44-763fe3160640",
        "title": "another"
      },
      "permissions": {
        "write": [
          "basicauth:0f7c1b72cdc89b9d42a2d48d5f0b291a1e8afd408cc38a2197cdf508269cecc8"
        ]
      }
    }
  ],
  "conflicts": [],
  "skipped": []
}

```
