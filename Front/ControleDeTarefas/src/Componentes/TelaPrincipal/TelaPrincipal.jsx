import React, { useEffect, useState } from "react";
import BarraPesquisa from "../BarraPesquisa/BarraPesquisa";
import FormularioTarefa from "../FormularioTarefa/FormularioTarefa";
import "./TelaPrincipal.css";
import api from "../../service/api";

const TelaPrincipal = () => {
    const [showForm, setShowForm] = useState(false);
    const [tarefas, setTarefas] = useState([]);
    const [filtroConcluido, setFiltroConcluido] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleFormOpen = () => setShowForm(true);
    const handleFormClose = () => setShowForm(false);

    const addTarefa = (tarefa) => {
        setTarefas([...tarefas, { ...tarefa, dataCriacao: new Date() }]);
        handleFormClose();
    };

    const getTarefaByTitulo = async () => {
        try {
            const response = await api.get(`Titulo`, {
                params: { titulo: searchTerm },
            });
            setTarefas([response.data]);
        } catch (error) {
            alert("Busca não encontrada");
        }
    };

    const getTarefaAll = async () => {
        try {
            const response = await api.get("/");
            setTarefas(response.data);
        } catch (error) {
            alert("Busca não encontrada");
        }
    };

    const toggleCompletion = (index) => {
        const updatedTasks = [...tarefas];
        const tarefa = updatedTasks[index];

        if (!tarefa.concluida) {
            alert(`O SLA da tarefa ${tarefa.titulo} Venceu.`);
        }

        tarefa.concluida = !tarefa.concluida;
        setTarefas(updatedTasks);
    };

    useEffect(() => {
        getTarefaAll();
    }, []);

    const filteredTasks = filtroConcluido
        ? tarefas.filter((tarefa) => tarefa.concluida)
        : tarefas;

    return (
        <div className="container">
            <h1>Controle de Tarefas</h1>
            <BarraPesquisa
                onAddTask={handleFormOpen}
                onSearch={getTarefaByTitulo}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
            {showForm && (
                <FormularioTarefa onAddTarefa={addTarefa} onClose={handleFormClose} />
            )}
            <div className="filter-controls">
                <label>
                    <input
                        type="checkbox"
                        checked={filtroConcluido}
                        onChange={() => setFiltroConcluido(!filtroConcluido)}
                    />
                    Mostrar apenas tarefas concluídas
                </label>
            </div>
            <div className="results-area">
                <div className="table-header">
                    <div className="table-cell">Título</div>
                    <div className="table-cell">Horas (SLA)</div>
                    <div className="table-cell">Arquivo</div>
                    <div className="table-cell">Concluído</div>
                </div>
                {filteredTasks.map((tarefa, index) => (
                    <div key={index} className="table-row">
                        <div className="table-cell">{tarefa.titulo ?? tarefa.title}</div>
                        <div className="table-cell">{tarefa.horario + " horas"}</div>
                        <div className="table-cell">
                            {tarefa.arquivo || "Nenhum arquivo"}
                        </div>
                        <div
                            className="table-cell"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <span>{tarefa.concluida ? "Sim" : "Não"}</span>
                            <button
                                onClick={() => toggleCompletion(index)}
                                style={{
                                    padding: "5px 10px",
                                    backgroundColor: "#4CAF50",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                }}
                            >
                                {tarefa.concluida ? "Concluído" : "Concluir"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TelaPrincipal;
