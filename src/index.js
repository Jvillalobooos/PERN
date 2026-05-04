const express = require(`express`);
const morgan = require(`morgan`);
const cors = require(`cors`);

const taskRoutes = require('./routes/tasks.routes.js');
const consultantRoutes = require('./routes/consultants.routes.js');
const workOrderRoutes = require('./routes/workOrders.routes.js');
const app = express();

app.use(morgan(`dev`));
app.use(express.json());
app.use(cors());
app.use("/api/consultants", consultantRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/work-orders", workOrderRoutes);
app.use((err,req, res, next) => {
   return res.json({ message: err.message });
});


app.listen(3000);

console.log("Servidor en el puerto 3000");