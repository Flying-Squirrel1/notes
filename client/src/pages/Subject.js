import { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
function Subject() {
  const { subject } = useParams(); // Destructure route parameters
  const [data, setData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors
  const camelToStr = (camelCase) => {
    let newStr = "";
    let letters = "abcdefghijklmnopqrstuvwxyz";
    for (let char of camelCase) {
      if (letters.includes(char)) {
        newStr = newStr + char;
      } else {
        newStr = newStr + " " + char;
      }
    }
    return newStr.slice(1);
  };
  const [value, setValue,] = useState(''); // Initial value for the editable span
  
const sendNewSubject =async ()=>{
    if (value === ""){
        return
    }
    try {
        const response = await fetch(`http://localhost:4000/${subject}/${value}`, {
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
        const response = await fetch(`http://localhost:4000/${subject}`); // Fetch data from API
        if (!response.ok) {
          throw new Error("Network response was not ok");
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
  }, [subject, loading]); // Re-run effect when `section` or `topic` changes



  
  if (loading) return <div>Loading...</div>; // Display loading message
  if (error) return <div>Error: {error.message}</div>; // Display error message
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return (
    <div>
      <h1>{`Current ${subject} blocks`}</h1>

     

      <div className="lCol">
        <span className="ting" onClick={() => sendNewSubject()}>
      <input
      type="text"
      defaultValue="type here.."
      value={value}
      onKeyDown={(e) => {
        if (e.key === "Enter")
            sendNewSubject();
        }}
      onChange={handleChange}
      className="editable-input" // Apply the CSS class
    />
    ⍆
        </span>

        {data.map((name) => {
          return <Link to={`/${subject}/${name}`}> {camelToStr(name)} </Link>;
        })}

        <Link to="/">Back</Link>
      </div>
    </div>
  );
}

export default Subject;
