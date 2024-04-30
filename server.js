const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = 3000;

const produtosPath = path.join(__dirname, 'produtos.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

function salvarDados(produtos) {
    fs.writeFileSync(produtosPath, JSON.stringify(produtos, null, 2));
}

app.get('/excluir-produto', (req, res) => {
    res.sendFile(path.join(__dirname, 'excluirproduto.html'));
});

app.post('/excluir-produto', (req, res) => {
    const { nome } = req.body;

    let produtosData = fs.readFileSync(produtosPath, 'utf-8');
    let produtos = JSON.parse(produtosData);

    const produtoIndex = produtos.findIndex(produto => produto.nome.toLowerCase() === nome.toLowerCase());

    if (produtoIndex === -1) {
        res.send('<h1>produto não encontrado.</h1>');
        return
    }

    res.send(`
    <script>
        if(confirm('Tem certeza de que deseja excluir o produto ${nome}?')) {
            window.location.href = '/excluir-produto-confirmado?nome=${nome}';
        } else {
            window.location.href = '/excluir-produto';
        }
        </script>`)
});

app.get('/excluir-produto-confirmado', (req,res) => {


    const nome = req.query.nome;

    let produtosData = fs.readFileSync(produtosPath, 'utf-8');
    let produtos = JSON.parse(produtosData);

    const produtoIndex = produtos.findIndex(produto => produto.nome.toLowerCase() === nome.toLowerCase());

    produtos.splice(produtoIndex, 1);

    salvarDados(produtos);

    res.send(`<h1>O produto ${nome} foi excluído com sucesso</h1>`)
});

app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`)
});