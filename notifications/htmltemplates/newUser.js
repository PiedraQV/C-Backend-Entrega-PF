const htmlNewUserTemplate = (id, date, cart) => {
    return `
    <h2>Hubo un nuevo pedido</h2>
    <p>Ya puedes ver el contenido del pedido</p>
    <ul>
        <li><strong>UUID:</strong> ${id}</li>
        <li><strong>FECHA:</strong> ${date}</li>
        <li><strong>FECHA:</strong> ${cart}</li>
    </ul>
    `
};
 
module.exports = {htmlNewUserTemplate};