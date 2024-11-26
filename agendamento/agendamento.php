<?php
header('Content-Type: application/json');

// Conexão com o banco de dados
$hostname = "localhost";
$username = "root";
$password = "";
$dbname = "bancojurema";

$conn = new mysqli($hostname, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["erro" => "Falha na conexão: " . $conn->connect_error]));
}

// Consulta SQL para buscar os agendamentos
$sql = "SELECT id_agendamento, nomefuncionario, data, horario, preco, nomecartao, numerocartao, validade, cvv FROM agendamento";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $agendamentos = [];
    while ($row = $result->fetch_assoc()) {
        $agendamentos[] = $row;
    }
    echo json_encode($agendamentos);
} else {
    echo json_encode([]);
}

$conn->close();
?>
