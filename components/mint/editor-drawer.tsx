import { range } from 'lodash';
import {
  useTheme,
  useMediaQuery,
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  NativeSelect,
  SxProps,
} from '@mui/material';
import {
  DeleteForever as DeleteForeverIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from '@mui/icons-material';

import { EraserIcon, BrickIcon, BlockIcon, DudeIcon, DoorIcon } from '../lib/icons';
import { TileType } from '../../lib/types';
import useContext from './context/hook';
import ResetDialog from './reset-dialog';

const NoIcon = () => null;

type ToolType = 'eraser' | 'brick' | 'block' | 'door' | 'dude';

const ToolItem = ({ desktopView }: { desktopView: boolean }) => {
  const {
    state: { tool },
    setTool,
  } = useContext();
  const tools: {
    [key in ToolType]: { text: string; Icon: ({ sx }: { sx?: SxProps }) => JSX.Element };
  } = {
    eraser: { text: 'Eraser', Icon: EraserIcon },
    brick: { text: 'Brick', Icon: BrickIcon },
    block: { text: 'Block', Icon: BlockIcon },
    door: { text: 'Door', Icon: DoorIcon },
    dude: { text: 'Dude', Icon: DudeIcon },
  };
  const tileToToolType: { [key in TileType]: ToolType } = {
    [TileType.EMPTY]: 'eraser',
    [TileType.BRICK]: 'brick',
    [TileType.BLOCK]: 'block',
    [TileType.DOOR]: 'door',
    [TileType.DUDE]: 'dude',
  };
  const toolToTileType: { [key in ToolType]: TileType } = {
    eraser: TileType.EMPTY,
    brick: TileType.BRICK,
    block: TileType.BLOCK,
    door: TileType.DOOR,
    dude: TileType.DUDE,
  };
  return (
    <ListItem sx={{ px: { xs: 1, lg: 2 }, py: { xs: 0, lg: 1 } }}>
      <FormControl fullWidth variant="standard">
        <InputLabel id="tool-select-label" sx={{ ml: { xs: 0, lg: 2 } }}>
          Tool
        </InputLabel>
        <Select
          sx={{ pt: 0.5 }}
          labelId="tool-select-label"
          value={tileToToolType[tool]}
          onChange={(event) => {
            setTool(toolToTileType[event.target.value as ToolType]);
          }}
          renderValue={(value) => {
            const { text, Icon } = tools[value];
            return (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Icon sx={{ ml: '10px', width: 20, height: 20 }} />
                {desktopView ? text : ''}
              </Box>
            );
          }}
          IconComponent={desktopView ? ArrowDropDownIcon : NoIcon}
        >
          {Object.entries(tools).map(([key, { text, Icon }]) => (
            <MenuItem key={key} value={key}>
              <Icon sx={{ width: 20, height: 20, mr: 1 }} /> {text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </ListItem>
  );
};

const DimensionItem = ({
  dimension,
  desktopView,
}: {
  dimension: 'width' | 'height';
  desktopView: boolean;
}) => {
  const {
    state: {
      level: { width, height },
    },
    setLevelWidth,
    setLevelHeight,
  } = useContext();
  const value = dimension === 'width' ? width : height;
  const setValue = dimension === 'width' ? setLevelWidth : setLevelHeight;
  return (
    <ListItem sx={{ px: { xs: 1, lg: 2 }, py: { xs: 1, lg: 1 } }}>
      <FormControl fullWidth>
        <InputLabel
          id={`${dimension}-select-label`}
          sx={{
            transform: {
              xs: 'translate(0) scale(0.75)',
              lg: 'translate(16px) scale(0.75)',
            },
            maxWidth: '58px',
            textTransform: 'capitalize',
          }}
        >
          {dimension}
        </InputLabel>
        <NativeSelect
          aria-labelledby={`${dimension}-select-label`}
          value={value}
          onChange={(event) => setValue(Number.parseInt(event.target.value, 10))}
          sx={{
            '& .MuiNativeSelect-select.MuiInput-input': {
              pr: 0,
              textAlign: { xs: 'center', lg: 'start' },
            },
          }}
          variant="standard"
          IconComponent={desktopView ? ArrowDropDownIcon : NoIcon}
        >
          {range(8, 33).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
    </ListItem>
  );
};

const ZoomInItem = () => {
  const {
    state: { zoom },
    zoomIn,
  } = useContext();
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={zoomIn} disabled={zoom === 8}>
        <ListItemIcon>
          <ZoomInIcon />
        </ListItemIcon>
        <ListItemText sx={{ display: { xs: 'none', lg: 'block' } }} primary="Zoom In" />
      </ListItemButton>
    </ListItem>
  );
};

const ZoomOutItem = () => {
  const {
    state: { zoom },
    zoomOut,
  } = useContext();
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={zoomOut} disabled={zoom === 8}>
        <ListItemIcon>
          <ZoomOutIcon />
        </ListItemIcon>
        <ListItemText sx={{ display: { xs: 'none', lg: 'block' } }} primary="Zoom Out" />
      </ListItemButton>
    </ListItem>
  );
};

const ResetItem = () => {
  const { openResetDialog } = useContext();
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={openResetDialog}>
        <ListItemIcon>
          <DeleteForeverIcon />
        </ListItemIcon>
        <ListItemText sx={{ display: { xs: 'none', lg: 'block' } }} primary="Reset" />
      </ListItemButton>
    </ListItem>
  );
};

const EditorDrawer = () => {
  const theme = useTheme();
  const desktopView = useMediaQuery(theme.breakpoints.up('lg'));
  const drawerWidth = desktopView ? 170 : 58;
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'hidden' }}>
        <List>
          <ToolItem desktopView={desktopView} />
          <DimensionItem dimension="width" desktopView={desktopView} />
          <DimensionItem dimension="height" desktopView={desktopView} />
          <ZoomInItem />
          <ZoomOutItem />
          <ResetItem />
        </List>
      </Box>
      <ResetDialog />
    </Drawer>
  );
};

export default EditorDrawer;
