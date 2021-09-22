import Head from 'next/head';
import Link from 'next/link';
import { utcToZonedTime, format } from 'date-fns-tz';

export async function getStaticProps() {
  const base = 'https://api.openweathermap.org/data/2.5';
  const key = process.env.OPENWEATHER_API_KEY;
  // https://openweathermap.org/api/one-call-api
  const res = await fetch(`${base}/onecall?lon=-122.332069&lat=47.606209&units=imperial&appid=${key}`);
  const json = await res.json();

  return { props: { json } };
}

export default function Index({ json }) {
  if (json.cod) {
    return (
      <div>
        <p>{json.cod}</p>
        <p>{json.message}</p>
      </div>
    )
  }

  return (
    <div>
      <div className='full'>
        <h1>Weattle.</h1>
        <p className='italics'>
          Weather in Seattle.&nbsp;
          {format(utcToZonedTime(new Date(json.current.dt * 1000), json.timezone), 'yyyy-MM-dd HH:mm (z)', { timeZone: json.timezone })}
        </p>
        <p><Link href='https://openweathermap.org/'>OpenWeatherMap</Link></p>
      </div>

      <div className='container'>
        <h3>Current</h3>
        <p>{Math.round(json.current.temp)}&deg;F ({json.current.weather.map(w => w.main).join(', ')})</p>
      </div>

      <div className='container'>
        <h3>Hourly</h3>

        {json.hourly.map((h, i) => {
          const d = utcToZonedTime(new Date(h.dt * 1000), json.timezone);
          const dt = format(d, 'MM-dd', { timeZone: json.timezone });
          const hr = format(d, 'HH', { timeZone: json.timezone });
          const dtpre = hr === '00' || i === 0 ? dt : (<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>);
          return (
            <p>
              {dtpre}&nbsp;{hr}:&nbsp;
              {Math.round(h.temp)}&deg;F ({h.weather.map(w => w.main).join(', ')})
            </p>
          );
        })}
      </div>

      <div className='container'>
        <h3>Daily</h3>

        {json.daily.map((day, i) => {
          const d = utcToZonedTime(new Date(day.dt * 1000), json.timezone);
          const dt = format(d, 'MM-dd', { timeZone: json.timezone });
          return (
            <p>
              {dt}:&nbsp;
              {Math.round(day.temp.day)}&deg;F [{Math.round(day.temp.min)}/{Math.round(day.temp.max)}] ({day.weather.map(w => w.main).join(', ')})
            </p>
          );
        })}
      </div>
    </div>
  )
}
