const conexion = require('../conexionDB');

const crear = async()=> {
    const connection = await conexion.conexionMysql();
    await connection.beginTransaction();

    try {
        const query = "SELECT COUNT(*) as count FROM usuarioRol";
        const [rolesExistentes] = await connection.query(query);
        const conteo = rolesExistentes[0].count;

        if(conteo > 0) {
            await connection.commit();
            return conteo;
        }

        const tipoRol = ["Administrador", "Gerente", "Empleado", "Cliente"];

        for (let i = 0; i < tipoRol.length; i++) {
            const rol = {
                idRol: `${i + 1}`,
                rolUsuario: tipoRol[i]
            }

            const query2 = "INSERT INTO usuarioRol (idRol, rolUsuario) VALUES (?,?)";
            await connection.query(query2, [rol.idRol, rol.rolUsuario]);
        }
        await connection.commit();

    } catch (error) {
        await connection.rollback();
        throw error;
        
    } finally {
        connection.release();
    }
}

const buscarByIdRol = async (idRol)=> {
    const connection  = await conexion.conexionMysql();
    try {
        const query3 = "SELECT * FROM usuarioRol WHERE idRol = ?";
        const [rows] = await connection.query(query3, [idRol]);
        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
        throw error;
    }
}

module.exports = {crear, buscarByIdRol}