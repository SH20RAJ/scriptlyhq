# ScriptlyStore - Product Management Skill for AI Agents

This guide details the APIs, schemas, and best practices for AI agents to list, create, edit, or delete digital products on [ScriptlyStore](https://scriptly.store).

## 1. Authentication
All API and MCP requests must include the `Authorization` header with the Agent API Key:
```http
Authorization: Bearer <AGENT_API_KEY>
```
*(Agents should find the local value for `AGENT_API_KEY` inside the project's `.env` file).*

---

## 2. Asset Upload Workflow (Images & GIFs)
Before creating or updating a product's image fields (`thumbnail`, `previewGif`, `screenshots`), agents **MUST** upload the assets to the `30tools/scriptly-assets` GitHub repository.

### Image/GIF Upload Steps:
1. Encode the file content into Base64.
2. Format a flat filename with an 8-byte random hex suffix to ensure uniqueness and prevent collisions:
   ```
   <sanitized_original_name>-<random_hex>.<extension>
   ```
   *Example:* `my-image-8b851a5d76efcfd1.png`
3. Call the GitHub Contents API to create/upload the file:
   `PUT https://api.github.com/repos/30tools/scriptly-assets/contents/<filename>`
4. Extract the exact commit hash `commit.sha` from the response.
5. Construct the `jsDelivr` CDN URL:
   `https://cdn.jsdelivr.net/gh/30tools/scriptly-assets@<commit_sha>/<filename>`
   *Example URL:* `https://cdn.jsdelivr.net/gh/30tools/scriptly-assets@85be7032af01206d78d46ba65219f5668a39580a/my-image-8b851a5d76efcfd1.png`

---

## 3. Product Fields & Schema Reference

| Field | Type | Description |
|---|---|---|
| `title` | String (Required) | The display title of the product. |
| `slug` | String (Required) | URL-friendly unique identifier (auto-sanitized to lowercase and hyphens). |
| `shortDescription` | String (Required) | A brief one-liner summary of the product. |
| `description` | String (Required) | A detailed product description (HTML/Markdown supported). |
| `category` | String (Required) | Category slug, typically `"ui-kits"`, `"boilerplates"`, `"scripts"`, etc. |
| `subcategory` | String | Subcategory slug if applicable. |
| `tags` | String | Comma-separated tags (e.g. `"nextjs, ui, animation"`). |
| `thumbnail` | String | jsDelivr URL of the thumbnail image. |
| `previewGif` | String | jsDelivr URL of the preview GIF/WebP (played on hover). |
| `screenshots` | String | Comma-separated jsDelivr URLs of screenshots. |
| `videoUrl` | String | Direct video URL or YouTube embed. |
| `demoUrl` | String | Live preview/demo website URL. |
| `fileUrl` | String | Protected download file path (e.g. `/uploads/<filename>.zip`). |
| `redirectDownload` | Boolean | If `true` (default), download routes automatically redirect. |
| `price` | Integer (Required) | Price in **paise** (INR cents, e.g. `2000` paise = ₹20.00). |
| `version` | String | Version number (defaults to `"1.0.0"`). |
| `featured` | Boolean | Whether to highlight the product on the home/featured section. |
| `published` | Boolean | Whether the product is listed publicly on the site (default `true`). |
| `isFree` | Boolean | Whether the product is free (default `false`). |
| `discountPercent` | Integer | Percentage discount (0 to 100, default `0`). |

---

## 4. REST API Endpoints

### 4.1 List Products
* **Endpoint:** `GET /api/agent/products`
* **Query Parameters (Optional):**
  * `category`: Filter by category.
  * `status`: Filter by status (`pending`, `approved`, `rejected`).
  * `published`: Filter by listing status (`true` or `false`).
  * `tag`: Search within tags (partial match).
  * `limit`: Limit results (default `100`, max `500`).
  * `offset`: Pagination offset (default `0`).
* **Response Example:**
  ```json
  {
    "success": true,
    "count": 1,
    "products": [
      {
        "id": "f6b307a7-ad71-468d-b7dc-e6dc3cf850d4",
        "title": "Menu Animation",
        "slug": "codrops-menu-animation",
        "price": 2500,
        "published": true,
        "tags": "animation, menu, codrops-import"
      }
    ]
  }
  ```

### 4.2 Create Product
* **Endpoint:** `POST /api/agent/products`
* **Headers:** `Content-Type: application/json`
* **Request Body:** Must contain the required schema fields.
* **Response Example (201 Created):**
  ```json
  {
    "success": true,
    "id": "e8d1e76d-fa52-456e-942e-7f39f3d0ed37",
    "slug": "custom-react-hook-pack"
  }
  ```

### 4.3 Get Single Product
* **Endpoint:** `GET /api/agent/products/<id_or_slug>`
* **Response Example:** Returns full product object details under `product`.

### 4.4 Update Product (PATCH)
* **Endpoint:** `PATCH /api/agent/products/<id_or_slug>`
* **Headers:** `Content-Type: application/json`
* **Request Body:** Partial object containing properties to update.
* **Response Example:**
  ```json
  {
    "success": true,
    "message": "Product updated successfully"
  }
  ```

### 4.5 Delete/Remove Product
* **Endpoint:** `DELETE /api/agent/products/<id_or_slug>`
* **Response Example:**
  ```json
  {
    "success": true,
    "message": "Product deleted successfully"
  }
  ```

---

## 5. Model Context Protocol (MCP) Tools
The platform hosts an MCP server at `https://scriptly.store/api/agents/mcp` allowing context-aware agents to perform all product CRUD operations directly.

### 5.1 `list_products`
* **Description:** Retrieve a catalog list of products.
* **Arguments:**
  * `category` (string, optional): Filter by category slug.
  * `limit` (number, optional): Maximum products to return (default: `50`, max: `200`).

### 5.2 `create_product`
* **Description:** Register and publish a new product in the store database.
* **Arguments (Required):**
  * `title` (string)
  * `slug` (string)
  * `shortDescription` (string)
  * `description` (string)
  * `category` (string)
  * `price` (number) - in paise (INR cents)
* **Arguments (Optional):**
  * `tags` (string), `thumbnail` (string), `previewGif` (string), `fileUrl` (string)

### 5.3 `update_product`
* **Description:** Modify an existing product listing.
* **Arguments:**
  * `id` (string, required): The UUID or slug of the product.
  * `title` (string, optional)
  * `slug` (string, optional)
  * `price` (number, optional)
  * `published` (boolean, optional)
  * `tags` (string, optional)

### 5.4 `delete_product`
* **Description:** Delete a product from the database permanently.
* **Arguments:**
  * `id` (string, required): The UUID or slug of the product to delete.

