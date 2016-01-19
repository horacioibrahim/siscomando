Diretório `elements` contém todos os componentes do projeto. É composto pelos
seguines diretórios:

 - `bower_components`: contém todos os elementos instalados pelo bower. Não
 necessariamente precisa ser mantido versionado;
 - `bower.json`: arquivo que contém as dependências do projeto para os elementos
 que foram instalados pelo bower;
 - `demo`: simples arquivos com json para testar a app. Não precisa ser versionado, mas são bastante úteis;
 - `layouts`: funciona como um template básico para que o conteúdo de determinadas páginas sejam combinados com eles;
 - `pages`: as páginas que geralmente carregam algum layout e combina seu conteúdo dentro dos locais previstos no layout geralmente usando a abordagem `<content select>`;
 - `sc-elements`: todos os elementos criados especificamente para o **Siscomando** , por isso o uso do sufixo sc-;
 - `test`: contém os tests.
 - `elements.html`: utilizado para importar todos os elementos do projeto para
 evitar problemas com a tentativa de carregar mais de um vez determinado elemento. Isso tem ocorrido quando tentamos usar o vulcanize. A ordem disposta
 é lógica e de acordo com as necessidades de uso, importamos os elementos. Ex.: se preciso de sc-home para page-home o primeiro elemento será importado antes.
