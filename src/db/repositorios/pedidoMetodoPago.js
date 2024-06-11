const conexion = require('../conexionDB');

const crear = async()=> {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const query = "SELECT COUNT(*) as count FROM pedidoMetodoPago";
        const [estadosExistentes] = await connection.query(query);
        const conteo = estadosExistentes[0].count;

        if(conteo > 0) {
            await connection.commit();
            return conteo;
        }

        const metodoPagoPedido = ["Efectivo", "Nequi", "Bancolombia - Ahorro a la mano"];

        for (let i = 0; i < metodoPagoPedido.length; i++) {
            const metodoPago = {
                idMetodoPago: `${i + 1}`,
                metodoPago: metodoPagoPedido[i]
            }

            const query2 = "INSERT INTO pedidoMetodoPago (idMetodoPago, metodoPago) VALUES (?,?)";
            await connection.query(query2, [metodoPago.idMetodoPago, metodoPago.metodoPago]);
        }
        await connection.commit();

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

module.exports = {crear}