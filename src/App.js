import "./App.css";
import Papa from "papaparse";
import { useState } from "react";

function App() {
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [cityFilterList, setCityFilterList] = useState([]);

  const [cityFilter, setCityFilter] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  const columnsSort = ["nome", "cidade", "idade"];
  const directionSort = [
    {
      sort: 1,
      title: "Menor para o maior",
    },
    {
      sort: -1,
      title: "Maior para o menor",
    },
  ];

  function handleCsv(e) {
    e.preventDefault();
    const files = e.target.files;
    if (files.length > 0) {
      convertCsvToJson(files);
    }
  }

  function convertCsvToJson(files) {
    let users = [];
    let cities = [];
    Papa.parse(files[0], {
      complete: (results) => {
        for (let i = 1; i < results.data.length; i++) {
          const data = {
            nome: results.data[i][0],
            idade: parseInt(results.data[i][1]),
            cidade: results.data[i][2],
          };

          cities.push(results.data[i][2]);

          users.push(data);
        }
        setOriginalData(users);
        setData(users);
        setCityFilterList(cities);
      },
    });
  }

  function filterResults(e) {
    e.preventDefault();
    setCityFilter(e.target.value);

    let dataFiltered = originalData.filter((e) => e.cidade === cityFilter);
    if (dataFiltered.length > 0) {
      setData(dataFiltered);
    } else {
      setData(originalData);
    }
  }

  function sortList(e) {
    e.preventDefault();

    setData(data.sort(newFilteredList(sortBy, sortDirection)));
  }

  function newFilteredList(column, order) {
    return function (a, b) {
      if (parseInt(order) === 1) {
        if (a[column] < b[column]) {
          return -1;
        }
      }
      if (parseInt(order) === -1) {
        if (a[column] > b[column]) {
          return -1;
        }
      }
      return 0;
    };
  }

  return (
    <div className="App">
      <div className="row">
        <h1 className="page-title">DG Sistemas</h1>
        <form className="form_select-file">
          <div className="form_select-file_input">
            <label htmlFor="input_csv">Selecionar arquivo</label>
            <input
              type={"file"}
              id="input_csv"
              name="input_csv"
              hidden
              accept=".csv"
              onChange={(e) => handleCsv(e)}
            />
          </div>
        </form>
      </div>

      <hr />

      <div className="row filter-area">
        <div className="column">
          <label htmlFor="">Filtrar por cidade</label>
          <select defaultValue={cityFilter} onChange={(e) => filterResults(e)}>
            <option>Escolher cidade</option>
            {cityFilterList.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <form onSubmit={sortList} className="row">
          <div className="column">
            <label htmlFor="">Ordernar por coluna</label>
            <select
              defaultValue={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Escolher coluna</option>
              {columnsSort.map((item, index) => (
                <option value={item} key={index}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="column">
            <label htmlFor="">Escolher direção</label>
            <select
              defaultValue={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
            >
              <option>Escolher direção</option>
              {directionSort.map((item, index) => (
                <option value={item.sort} key={index}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Ordenar</button>
        </form>
      </div>

      <hr />

      {data.length > 0 ? (
        <>
          <div className="row">
            <h2 className="results_title">Dados:</h2>
          </div>
          <ul className="column results_list">
            {data.map((item, index) => (
              <li
                className="row results_list_item"
                key={index}
              >{`${item.nome} - Idade: ${item.idade} - Cidade: ${item.cidade}`}</li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

export default App;
