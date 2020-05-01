import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import { SketchPicker } from 'react-color';
import {write} from 'ieee754';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import './App.css';

const theme = createMuiTheme({
	  palette: {
			    primary: purple,
			    secondary: green,
					type: 'dark'
			  },
	  status: {
			    danger: 'orange',
			  },
});

function App() {
	const [color, setColor] = useState({r: 0, g: 0, b: 0, a: 1});
	const [endianness, setEndianness] = useState('little')
  const [format, setFormat] = useState('ARGB')

	const generate_aob = color => {
		const _color = JSON.parse(JSON.stringify(color));
		['r', 'g', 'b'].map(v => {_color[v] = (_color[v]/255)});
		_color.a = (_color.a);

    let order = format === 'ARGB' ? ['a', 'r', 'g', 'b'] : ['r', 'g', 'b', 'a'];
		return order.reduce((acc, v) => {
			let b = [0, 0, 0, 0];
			write(b, _color[v], 0, endianness === 'little', 23, 4);
			b = b.map(v => ("00" + v.toString(16)).slice(-2)).join('');
			return acc + ' ' + b;

		}, '');

	}

  return (
		<ThemeProvider theme={theme}>
    <div className="App">
      <header className="App-header">
				<div>
					<SketchPicker
						color={ color }
						onChange={ c => setColor(c.rgb) } />
				</div>
				<div style={{margin: 20}}>
					<InputLabel>Endianness</InputLabel>
					<Select
						value={endianness}
						onChange={v => setEndianness(v.target.value)} >
						<MenuItem value='little'>Little-endian</MenuItem>
						<MenuItem value='big'>Big-endian</MenuItem>
					</Select>
				</div>
				<div style={{margin: 20}}>
					<InputLabel>Format</InputLabel>
					<Select
						value={format}
						onChange={v => setFormat(v.target.value)} >
						<MenuItem value='ARGB'>ARGB (Yakuza 0 Pibs)</MenuItem>
						<MenuItem value='RGBI'>RGBI (Yakuza Kiwami 2 Pibs)</MenuItem>
					</Select>
				</div>
				<p>Copy the bytes</p>
				<p>{generate_aob(color)}</p>
      </header>
    </div>
		</ThemeProvider>
  );
}

export default App;
