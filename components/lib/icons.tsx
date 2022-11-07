import { SxProps, SvgIcon } from '@mui/material';

import { SpritePath } from './sprite';

export const EraserIcon = ({ sx }: { sx?: SxProps }) => (
  <SvgIcon sx={{ ...sx, background: '#fff' }} />
);

export const BrickIcon = ({ sx }: { sx?: SxProps }) => (
  <SvgIcon sx={sx} viewBox="0 -0.5 8 8">
    <SpritePath type="brick" color="#fff" />
  </SvgIcon>
);

export const BlockIcon = ({ sx }: { sx?: SxProps }) => (
  <SvgIcon sx={sx} viewBox="0 -0.5 8 8">
    <SpritePath type="block" color="#fff" />
  </SvgIcon>
);

export const DudeIcon = ({ sx }: { sx?: SxProps }) => (
  <SvgIcon sx={sx} viewBox="0 -0.5 8 8">
    <SpritePath type="dude" color="#fff" />
  </SvgIcon>
);

export const DoorIcon = ({ sx }: { sx?: SxProps }) => (
  <SvgIcon sx={sx} viewBox="0 -0.5 8 8">
    <SpritePath type="door" color="#fff" />
  </SvgIcon>
);
