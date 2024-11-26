<?php
$servername = "localhost";
$username = "root";
$password = ""; 
$dbname = "bancojurema";


$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die(json_encode(["success" => false, "error" => "Erro ao conectar com o banco de dados: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $nomefuncionario = $data['nomefuncionario'];
    $data_agendamento = $data['data'];
    $horario = $data['horario'];
    $preco = $data['preco'];
    $nomecartao = $data['nomecartao'];
    $numerocartao = $data['numerocartao'];
    $validade = $data['validade'];
    $cvv = $data['cvv'];

    $sql = "INSERT INTO agendamento (nomefuncionario, data, horario, preco, nomecartao, numerocartao, validade, cvv) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("sssdssss", $nomefuncionario, $data_agendamento, $horario, $preco, $nomecartao, $numerocartao, $validade, $cvv);

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "error" => "Erro ao inserir os dados: " . $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(["success" => false, "error" => "Erro na preparação da consulta: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Nenhum dado recebido."]);
}

$conn->close();
?>
