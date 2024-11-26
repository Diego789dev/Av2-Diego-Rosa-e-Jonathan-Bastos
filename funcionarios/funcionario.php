<?php
header('Content-Type: application/json');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    $pdo = new PDO("mysql:host=localhost;dbname=bancojurema;charset=utf8", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $filter = isset($_POST['filter']) ? $_POST['filter'] : 'all';
    $queryStr = "SELECT id_funcionario, nome, cargo, carga_horaria, tempo_servico, foto, precoservico FROM funcionario";

    if ($filter !== 'all') {
        $queryStr .= " WHERE cargo = :cargo";
    }

    $stmt = $pdo->prepare($queryStr);

    if ($filter !== 'all') {
        $stmt->bindParam(':cargo', $filter);
    }

    $stmt->execute();

    $funcionarios = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $funcionarios[] = [
            "id_funcionario" => $row["id_funcionario"],
            "nome" => $row["nome"],
            "cargo" => $row["cargo"],
            "carga_horaria" => $row["carga_horaria"],
            "tempo_servico" => $row["tempo_servico"],
            "foto" => $row["foto"],
            "precoservico" => floatval($row["precoservico"])
        ];
    }

    echo json_encode($funcionarios);

} catch (PDOException $e) {
    echo json_encode(["erro" => $e->getMessage()]);
}
?>
