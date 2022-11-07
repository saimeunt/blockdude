import {
  Unstable_Grid2 as Grid,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardActions,
  Button,
  Typography,
} from '@mui/material';

import { NextLinkComposed } from '../lib/link';
import levels from '../../lib/levels';
import { LevelData } from '../../lib/types';
import Thumbnail from '../lib/thumbnail';

const LevelCard = ({ level }: { level: LevelData }) => (
  <Card>
    <CardActionArea component={NextLinkComposed} to={`/levels/${level.id}`}>
      <Box
        sx={{
          height: 160,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Thumbnail level={level} />
      </Box>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {level.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {level.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onTouchStart={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => event.preventDefault()}
        >
          Share
        </Button>
        <Button
          size="small"
          onTouchStart={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => event.preventDefault()}
        >
          Like
        </Button>
      </CardActions>
    </CardActionArea>
  </Card>
);

const LevelsGrid = () => (
  <Grid container spacing={2}>
    {levels.map((level) => (
      <Grid key={level.id} xs={12} sm={6} md={3}>
        <LevelCard level={level} />
      </Grid>
    ))}
  </Grid>
);

export default LevelsGrid;
