import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CodeDisplayComponent } from '../code-display/code-display.component';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, CodeDisplayComponent],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent {
  databaseSchemaCode = `{
  "schema": {
    "example": {}
  },
  "tables": {
    "users": {
      "schema": "example",
      "columns": {
        "id": {
          "null": false,
          "type": "int"
        },
        "first_name": {
          "null": true,
          "type": "varchar"
        },
        "last_name": {
          "null": true,
          "type": "varchar"
        }
      },
      "primary_key": {
        "columns": ["id"]
      }
    },
    "orders": {
      "schema": "example",
      "columns": {
        "id": {
          "null": false,
          "type": "int"
        },
        "name": {
          "null": true,
          "type": "varchar"
        },
        "user_id": {
          "null": false,
          "type": "int"
        },
        "product_id": {
          "null": false,
          "type": "int"
        }
      },
      "primary_key": {
        "columns": ["id"]
      },
      "foreign_keys": {
        "product_fk": {
          "columns": ["product_id"],
          "ref_columns": ["products.id"],
          "on_update": "NO_ACTION",
          "on_delete": "NO_ACTION"
        },
        "user_fk": {
          "columns": ["user_id"],
          "ref_columns": ["users.id"],
          "on_update": "NO_ACTION",
          "on_delete": "NO_ACTION"
        }
      }
    },
    "products": {
      "schema": "example",
      "columns": {
        "id": {
          "null": false,
          "type": "int"
        },
        "name": {
          "null": true,
          "type": "varchar"
        },
        "description": {
          "null": false,
          "type": "int"
        },
        "quantity": {
          "null": false,
          "type": "int"
        }
      },
      "primary_key": {
        "columns": ["id"]
      }
    },
    "categories": {
      "schema": "example",
      "columns": {
        "id": {
          "null": false,
          "type": "int"
        },
        "title": {
          "null": false,
          "type": "varchar"
        },
        "description": {
          "null": true,
          "type": "varchar"
        }
      },
      "primary_key": {
        "columns": ["id"]
      }
    },
    "suppliers": {
      "schema": "example",
      "columns": {
        "id": {
          "null": false,
          "type": "int"
        },
        "company_name": {
          "null": false,
          "type": "varchar"
        },
        "contact_name": {
          "null": true,
          "type": "varchar"
        },
        "phone": {
          "null": true,
          "type": "varchar"
        }
      },
      "primary_key": {
        "columns": ["id"]
      }
    },
    "inventory": {
      "schema": "example",
      "columns": {
        "id": {
          "null": false,
          "type": "int"
        },
        "product_id": {
          "null": false,
          "type": "int"
        },
        "supplier_id": {
          "null": false,
          "type": "int"
        },
        "stock": {
          "null": false,
          "type": "int"
        },
        "warehouse_location": {
          "null": true,
          "type": "varchar"
        }
      },
      "primary_key": {
        "columns": ["id"]
      },
      "foreign_keys": {
        "product_fk": {
          "columns": ["product_id"],
          "ref_columns": ["products.id"],
          "on_update": "CASCADE",
          "on_delete": "CASCADE"
        },
        "supplier_fk": {
          "columns": ["supplier_id"],
          "ref_columns": ["suppliers.id"],
          "on_update": "CASCADE",
          "on_delete": "SET_NULL"
        }
      }
    }
  }
}`;
}
