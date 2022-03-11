import React, { useState, useEffect }  from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

const CommonDialog: React.FC<{
  msg: any,
  isOpen: any,
  doYes: any,
  doNo: any,
}> = ({msg, isOpen, doYes, doNo}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);
  
  return (
    <>
      <div>
        <Dialog
          open={open}
          keepMounted
          onClose={() => doNo()}
          aria-labelledby="common-dialog-title"
          aria-describedby='common-dialog-description'
        >
          <DialogContent>
            {msg}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => doNo()} color="primary">
              No
            </Button>
            <Button onClick={() => doYes()} color="primary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default CommonDialog;
