import { useEffect, useState } from 'react';

export function useFetchDatesWithLessons(resort,sport,members) {
  const [datesWithLesson, setDatesWithLesson] = useState([]);

  useEffect(() => {

    let canceled = false;

    const fetchDates = async () => {


      try {
        setDatesWithLesson([])


        const queryParams = new URLSearchParams({
            resort,
            sport,
            members: String(members), 
        });

        
        const url = `/api/getDatesWithLessons?${queryParams.toString()}`;


        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dates = (await response.json()).datesWithLessons


        if(!canceled){
            setDatesWithLesson(dates)
        }


      } catch (error) {
        console.error('Fetch error:', error);

      }
    }

    fetchDates()

    return ()=> {
        canceled=true
    }
  }, [resort,sport,members]);

  return datesWithLesson
}