import "../public/style.css";

const liste = document.querySelector("#liste");
const form = document.querySelector("#form");
const message = document.querySelector("#message");

function afficherCommandes(commandes) {
  liste.replaceChildren();

  if (commandes.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = "Aucune commande.";
    row.append(cell);
    liste.append(row);
    return;
  }

  commandes.forEach((commande) => {
    const row = document.createElement("tr");

    [commande.id, commande.item, commande.quantity, `${commande.price} €`].forEach(
      (value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.append(cell);
      },
    );

    liste.append(row);
  });
}

async function chargerCommandes() {
  try {
    const response = await fetch("/commandes");
    if (!response.ok) {
      throw new Error("Impossible de charger les commandes.");
    }

    afficherCommandes(await response.json());
  } catch (error) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = error.message;
    row.append(cell);
    liste.replaceChildren(row);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";

  const data = new FormData(form);
  try {
    const response = await fetch("/commandes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        item: data.get("item"),
        quantity: Number(data.get("quantity")),
        price: Number(data.get("price")),
      }),
    });

    if (!response.ok) {
      throw new Error("Impossible de créer la commande.");
    }

    form.reset();
    message.textContent = "Commande créée.";
    await chargerCommandes();
  } catch (error) {
    message.textContent = error.message;
  }
});

chargerCommandes();
