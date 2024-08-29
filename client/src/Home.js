import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
function Home() {
  
  const [data, setData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors
  const [value, setValue,] = useState(''); // Initial value for the editable span

  const sendNewSubject =async ()=>{
    if (value === ""){
        return
    }
    try {
        const response = await fetch(`http://localhost:4000/${value}`, {
          method: 'POST', // Specify the request method
        });
        
  
        const data = await response.json(); // Parse the JSON response
        console.log('Success:', data); // Handle the response data as needed
        setLoading(true);
        setValue("");
      } catch (error) {
        console.error('Error:', error); // Handle any errors that occur
      }
}
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/`); // Fetch data from API
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json(); // Convert response to JSON
        setData(data); // Store the fetched data
      } catch (error) {
        setError(error); // Handle errors
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchData();
  }, [loading]); // Re-run effect when `section` or `topic` changes

  if (loading) return <div>Loading...</div>; // Display loading message
  if (error) return <div>Error: {error.message}</div>; // Display error message
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return (
    <div>
      <h1>{`Current  subjects`}</h1>
      <div className="lCol">
      <span className="ting" onClick={() => sendNewSubject()}>
      <input
      type="text"
      onKeyDown={(e) => {
        if (e.key === "Enter")
            sendNewSubject();
        }}
      defaultValue="type here.."
      value={value}
      onChange={handleChange}
      className="editable-input" // Apply the CSS class
    />
    ⍆
        </span>
      {data.map(name => {
        return (<Link to={`/${name}`}> {name} </Link>)
      })}
      </div>
    </div>
  );
}

export default Home;