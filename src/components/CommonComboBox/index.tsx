import React, { useState, useEffect }  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(2),
    marginBottom: theme.spacing(5),
  },
}));

export interface ComboBoxItem {
  id: string;
  value: string;
};

type Props = {
  inputLabel: string;
  items: ComboBoxItem[];
  defaultValue: string;
  value: string;
  onChange: (selected: string) => void;
};

const CommonComboBox: React.FC<Props> = (props) => {
  const { inputLabel, items, value, defaultValue, onChange } = props;
  const classes = useStyles();

  return (
    <>
    <FormControl className={classes.formControl}>
      <InputLabel>{inputLabel}</InputLabel>
      <Select
        defaultValue={defaultValue}
        value={value}
        onChange={(e) => {
          if (e.target.value != undefined) {
            onChange(e.target.value as string);
          };
        }}
      >
        {items.map((item) => (
          <MenuItem value={item.id} key={item.id}>
            {item.value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    </>
  );
}

export default CommonComboBox;
