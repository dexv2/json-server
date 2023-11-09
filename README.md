# JSON, CSV, XML to JSON Auto-conversion server (Item #1)

### Sample Data Fetching:

POST http://localhost:3003/api/products
```json
{
  "apiUrl": "http://localhost:3002/api/toyshop",
  "companyName": "Toy Shop"
}
```
Should return JSON type data like this:
```json
{
  "company_name": "Toy Shop",
  "products": [
    {
      "name": "Hungry Bear",
      "price": "57"
    },
    {
      "name": "Owl Babies",
      "price": "27"
    },
    {
      "name": "Gingerbread Boy",
      "price": "25"
    },
    {
      "name": "Stuff Toy",
      "price": "22"
    }
  ]
}
```

# Auto-save data from XML files to database (Item #2)

Gets data from XML files, parse it and save to database.
On this app, this only happens automatically when the server is up.

### Improvements
It can be improved with pagination and adding a scheduler that saves
new data from time to time

### Sample Query
Note: Run the **ERP API server** first to get the order from this server

POST http://localhost:3003/api/order/new
Request Body (XML)

```xml
<order_detail>
    <id>10</id>
</order_detail>
```

Respose:
```json
{
  "id": "10",
  "status": "OK",
  "message": "Order received"
}
```

Then it will automatically send complete details to ERP
- See console log on this server
- See also console log on ERP server that shows that it received the order
