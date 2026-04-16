"""
Seed script: Insert 6 kitchen & living room products into the Tuyo database.

Connects directly to MySQL — no Django required.

Usage:
    pip install mysql-connector-python
    python seed_kitchen_livingroom.py

Requires env vars: dbhost, dbuser, dbpassword, dbtuyo
"""
import os
import sys
from datetime import datetime, timezone

import mysql.connector

# -- DB connection (local Docker by default, or env vars for remote) --
DB_CONFIG = {
    "host": os.environ.get("dbhost", "127.0.0.1"),
    "user": os.environ.get("dbuser"),
    "password": os.environ.get("dbpassword"),
    "database": os.environ.get("dbtuyo", "devlocal"),
    "port": int(os.environ.get("dbport", "3307")),
    "charset": "utf8mb4",
}

# -- Reference IDs (from existing DB seed data) --
STATE_PUBLISHED = 2   # DonationState "Published"
TYPE_PUBLIC = 1        # DonationType "Public"
FORUM_STATE_OPEN = 2   # ForumState "Open"
CREATOR_ID = 2         # SystemUser admin

# -- Products to create --
PRODUCTS = [
    # Kitchen
    {
        "title": "Juego de ollas de acero inoxidable",
        "description": (
            "Tengo un juego de 5 ollas de acero inoxidable en muy buen estado. "
            "Incluye ollas de distintos tamanos con sus tapas. Ideales para cocinar "
            "para toda la familia. Las regalo porque me mude y ya no las necesito."
        ),
        "pickup_description": "Coordinar retiro de lunes a viernes de 10 a 18hs",
        "max_applicants": 50,
    },
    {
        "title": "Licuadora en buen estado",
        "description": (
            "Regalo licuadora de vaso de vidrio, funciona perfectamente. "
            "La uso poco porque compre una procesadora. Tiene 3 velocidades "
            "y funcion pulsar. Excelente para jugos, batidos y salsas."
        ),
        "pickup_description": "Disponible para retiro los fines de semana",
        "max_applicants": 30,
    },
    {
        "title": "Set de utensilios de cocina de madera",
        "description": (
            "Dono un set completo de utensilios de cocina de madera: cucharon, "
            "espatula, tenedor, cuchara para revolver y pinzas. Estan en perfecto "
            "estado, apenas usados. Perfectos para sartenes antiadherentes."
        ),
        "pickup_description": "Retiro por zona centro, horario a coordinar",
        "max_applicants": 40,
    },
    # Living room
    {
        "title": "Sofa de dos plazas color gris",
        "description": (
            "Regalo sofa de dos plazas en color gris claro. Esta en buenas "
            "condiciones, sin manchas ni roturas. Muy comodo y perfecto para "
            "un living pequeno o departamento. Se entrega desenfundado para "
            "facilitar el traslado."
        ),
        "pickup_description": "Coordinar retiro, se necesita vehiculo grande",
        "max_applicants": 20,
    },
    {
        "title": "Mesa de centro de madera maciza",
        "description": (
            "Tengo una mesa de centro de madera maciza en tono natural. "
            "Mide 90cm x 50cm, altura 45cm. Tiene algunas marcas de uso "
            "pero se puede restaurar facilmente. Ideal para living o sala de estar."
        ),
        "pickup_description": "Disponible para retiro cualquier dia con previo aviso",
        "max_applicants": 25,
    },
    {
        "title": "Lampara de pie moderna",
        "description": (
            "Dono lampara de pie estilo moderno con pantalla blanca y base "
            "metalica. Altura regulable. Funciona perfecto, la cambio porque "
            "redisene la decoracion del living. Queda muy bien en cualquier "
            "rincon de lectura o junto al sofa."
        ),
        "pickup_description": "Retiro de lunes a sabado en horario de tarde",
        "max_applicants": 35,
    },
]


def main():
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

    # Verify creator exists
    cursor.execute(
        "SELECT id FROM SystemUser WHERE id = %s", (CREATOR_ID,)
    )
    if not cursor.fetchone():
        sys.exit(f"SystemUser id={CREATOR_ID} not found. Update CREATOR_ID in script.")

    created_ids = []

    for product in PRODUCTS:
        # 1) Create a public forum
        cursor.execute(
            "INSERT INTO TuyoTools_accounts_forum (state_id, deleted, date_deleted, is_private) "
            "VALUES (%s, %s, %s, %s)",
            (FORUM_STATE_OPEN, False, None, False),
        )
        forum_id = cursor.lastrowid

        # 2) Create entity for the forum (type 'F')
        cursor.execute(
            "INSERT INTO TuyoTools_accounts_entity (object_id, type_of_entity) VALUES (%s, %s)",
            (forum_id, "F"),
        )

        # 3) Create the donation
        cursor.execute(
            "INSERT INTO TuyoTools_accounts_donation "
            "(title, description, created, enabled, deleted, date_deleted, "
            " max_applicants, anonymous_data, prior_state_id, state_id, type_id, "
            " creator_id, public_forum_id, count_likes, date_modified, date_updated, "
            " pickup_description, mandatory, thumbnail, fbthumbnail) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (
                product["title"],
                product["description"],
                now,
                True,       # enabled
                False,      # deleted
                None,       # date_deleted
                product["max_applicants"],
                None,       # anonymous_data
                None,       # prior_state_id
                STATE_PUBLISHED,
                TYPE_PUBLIC,
                CREATOR_ID,
                forum_id,
                0,          # count_likes
                now,        # date_modified
                now,        # date_updated
                product["pickup_description"],
                True,       # mandatory
                "",         # thumbnail
                "",         # fbthumbnail
            ),
        )
        donation_id = cursor.lastrowid

        # 4) Create entity for the donation (type 'D')
        cursor.execute(
            "INSERT INTO TuyoTools_accounts_entity (object_id, type_of_entity) VALUES (%s, %s)",
            (donation_id, "D"),
        )

        created_ids.append((donation_id, product["title"]))
        print(f"  Created: [{donation_id}] {product['title']}")

    conn.commit()
    cursor.close()
    conn.close()

    print(f"\nDone! Created {len(created_ids)} products (donations).")


if __name__ == "__main__":
    main()
