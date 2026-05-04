const pool = require('../db');

const getAllConsultants = async (req, res, next) => {
    try {
        const result = await pool.query("SELECT * FROM consultants");
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
    
};

const getConsultantById = async (req, res, next) => {
    try {
        const { id } = req.params;
       
        const resultid = await pool.query("SELECT * FROM consultants WHERE id = $1", [id]);
        if (resultid.rows.length === 0) {
            return res.status(404).json({ message: "Consultor no encontrado" });
        }
        res.json(resultid.rows[0]);
    } catch (error) {
        next(error);
    }
    
};

const createConsultant = async (req, res, next) => {
 const {name, specialty}  =  req.body; // Aquí se puede acceder a los datos enviados en el cuerpo de la solicitud
 try {
     const result = await pool.query(
         "INSERT INTO consultants (name, specialty) VALUES ($1, $2) RETURNING *",
         [name, specialty]
     );
     res.json(result.rows[0]); // Devuelve el consultor recién creado como respuesta
 } catch (error) {
  next(error);
 }  
};





module.exports = {
    getAllConsultants,
    getConsultantById,
    createConsultant,
   
}