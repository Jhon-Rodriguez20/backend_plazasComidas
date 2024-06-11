const conexion = require('../conexionDB');

const crear = async () => {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const query = "SELECT COUNT(*) as count FROM pedidoEstado";
        const [estadosExistentes] = await connection.query(query);
        const conteo = estadosExistentes[0].count;

        if (conteo > 0) {
            await connection.commit();
            return conteo;
        }

        const estadoPedido = ["Pendiente", "Preparando", "Listo", "Entregado"];

        for (let i = 0; i < estadoPedido.length; i++) {
            const estado = {
                idEstado: `${i + 1}`,
                estado: estadoPedido[i]
            }

            const query2 = "INSERT INTO pedidoEstado (idEstado, estado) VALUES (?, ?)";
            await connection.query(query2, [estado.idEstado, estado.estado]);
        }
        await connection.commit();

    } catch (error) {
        await connection.rollback();
        throw error;
        
    } finally {
        connection.release();
    }
}

module.exports = { crear }