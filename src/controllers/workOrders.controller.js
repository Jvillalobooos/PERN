const pool = require('../db');

const getAllworkOrders = async (req, res, next) => {
    try {
        const result = await pool.query("SELECT * FROM work_orders");
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
    
};

const getWorkOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
       
        const resultid = await pool.query("SELECT * FROM work_orders WHERE id = $1", [id]);
        if (resultid.rows.length === 0) {
            return res.status(404).json({ message: "Orden de trabajo no encontrada" });
        }
        res.json(resultid.rows[0]);
    } catch (error) {
        next(error);
    }
    
};

const createWorkOrder = async (req, res, next) => {
 const {title, description, priority, status, estimated_hours, consultant_id}  =  req.body; // Aquí se puede acceder a los datos enviados en el cuerpo de la solicitud
 try {
     const result = await pool.query(
         "INSERT INTO work_orders (title, description, priority, status, estimated_hours, consultant_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
         [title, description, priority, status, estimated_hours, consultant_id]
     );
     res.json(result.rows[0]); // Devuelve la orden de trabajo recién creada como respuesta
 } catch (error) {
  next(error);
 }  
};

const searchAndAssignmentWorkOrder = async (req, res, next) => {
    const { id } = req.params;// Aquí se puede acceder al ID de la orden de trabajo desde los parámetros de la URL
    try { // Aquí se puede acceder al ID de la orden de trabajo desde los parámetros de la URL
        const workOrderResult = await pool.query("SELECT * FROM work_orders WHERE id = $1", [id]); // Busca la orden de trabajo por su ID en la base de datos
        if (workOrderResult.rows.length === 0) { // Si no se encuentra la orden de trabajo, devuelve un error
            return res.status(404).json({ message: "Orden de trabajo no encontrada" });
        }

        const workOrder = workOrderResult.rows[0]; // Guarda la orden de trabajo encontrada en una variable para su posterior uso
        if (workOrder.consultant_id) { // Verifica si la orden de trabajo ya tiene un consultor asignado
            return res.status(400).json({ message: "La orden de trabajo ya está asignada a un consultor" });
        }
        
        const consultantResult = await pool.query( // Busca un consultor disponible que tenga suficiente capacidad para asumir la orden de trabajo
            "SELECT * FROM consultants WHERE current_workload + $1 <= max_hours_per_week ORDER BY current_workload ASC LIMIT 1", // Ordena los consultores por su carga de trabajo actual de forma ascendente y limita la búsqueda a un solo consultor
            [workOrder.estimated_hours] // Utiliza las horas estimadas de la orden de trabajo para verificar si el consultor tiene suficiente capacidad para asumirla
        )
        if (consultantResult.rows.length === 0) { // Si no se encuentra un consultor disponible, devuelve un error
            return res.status(400).json({ message: "No hay consultores disponibles para asignar esta orden de trabajo" });
        }

        const consultant = consultantResult.rows[0]; // Si se encuentra un consultor disponible, asigna la orden de trabajo a ese consultor y actualiza su carga de trabajo
        const assigResult = await pool.query( // Asigna la orden de trabajo al consultor encontrado y actualiza su carga de trabajo
            "UPDATE work_orders SET consultant_id = $1, status = 'asignado' WHERE id = $2 RETURNING *",
            [consultant.id, id]
        );
        await pool.query(// Actualiza la carga de trabajo del consultor sumando las horas estimadas de la orden de trabajo asignada
            "UPDATE consultants SET current_workload = current_workload + $1 WHERE id = $2", // Actualiza la carga de trabajo del consultor sumando las horas estimadas de la orden de trabajo asignada
            [workOrder.estimated_hours, consultant.id] // Utiliza las horas estimadas de la orden de trabajo para actualizar la carga de trabajo del consultor
        );
        res.json({
            message: "Orden de trabajo asignada exitosamente",
            workOrder: assigResult.rows[0],
            consultant: consultant
        });
            }
        catch (error) { next(error) } // Devuelve la orden de trabajo actualizada con el consultor asignado

    }




module.exports = {
    getAllworkOrders,
    getWorkOrderById,
    createWorkOrder,
    searchAndAssignmentWorkOrder
}