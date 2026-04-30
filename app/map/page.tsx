'use client';
import { Grid, GridItem, Box, Card, Text, Flex, Button, Slider, SliderValueChangeDetails, Heading, Badge, SegmentGroup } from '@chakra-ui/react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, BarShapeProps } from 'recharts';
import Map, { MapRef, Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getSightingDetails, getFilterCount, getSigtingsCountByYear, getLocalDensity, getMonthlySighthingsByYear } from '../actions/actions';
import { validateAlienMapBlipSchema } from '@/types';
import type { AlienBlipSupabaseType } from '@/types';
import { useEffect, useState, useRef } from 'react';
import { Filter, UfoYearlyCountArray, UfoYearlyCountType, UfoYearlyCountValidationSchema, UfoSightingsByMonthArrayType, UfoSightingsByMonth } from '@/types';
import { keyframes } from '@emotion/react';
import { LuCopy, LuMapPin, LuExternalLink, LuMap } from 'react-icons/lu';
import Link from 'next/link';

const revealText = keyframes`
  from { opacity: 0; transform: translateY(-10px); filter: blur(1px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
`
interface NumberDict {
  [key: number]: string
}

const monthMap: NumberDict = { 1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sept", 10: "Oct", 11: "Nov", 12: "Dec" }

interface HistogramSliderType {
  data: UfoYearlyCountArray;
  activeRange: Filter
  onFilterChange: (e: SliderValueChangeDetails) => void;
}

interface CompassElementProps {
  lat: number;
  lng: number;
}

interface MonthlyFilters {
  startMonth: number
  endMonth: number
}

interface HistogramMonthlySliderType {
  data: UfoSightingsByMonthArrayType;
  activeRange: MonthlyFilters;
  onMonthChange: (e: SliderValueChangeDetails) => void;
}

type ViewingMode = "Pinpoints" | "Heatmap"

function CompassElement(props: CompassElementProps) {
  const { lat, lng } = props;
  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;

  return (
    <Box p={3} borderRadius={"md"} bg={"whiteAlpha.50"} border={'1px solid'} borderColor={"whiteAlpha.100"}>
      <Flex alignItems={'center'} gap={3} mb={2}>
        <LuMapPin size={16} color='#3182ce' />
        <Link href={streetViewUrl} target='_blank'>
          <Badge colorScheme={'blue'} variant={'subtle'} cursor={'pointer'} display={'flex'} alignItems={'center'} gap={1}>
            Street View <LuExternalLink size={10} />
          </Badge>
        </Link>
      </Flex>
    </Box> 
  )
}

function HistogramSlider({ data, onFilterChange, activeRange }: HistogramSliderType) {
  const [sliderVals, setSliderVals] = useState([1969, 2019]);

  const customBar = (props: BarShapeProps) => {
    const { x, y, width, height } = props;
    const { payload } = props;
    const ufoYearlyCount = UfoYearlyCountValidationSchema.parse(payload);
    const isActive = ufoYearlyCount.year >= activeRange.startYear && ufoYearlyCount.year <= activeRange.endYear;
    const fillColor = isActive ? "#3182ce" : "#2d3748";
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fillColor}
        rx={2}
        style={{ transition: 'fill 0.3 ease' }}
      />
    )
  }

  return (
    <Flex direction={'column'} gap={0} position={'relative'} height={'120px'}>
      <Box w={'100%'} height={'80px'} opacity={0.6}>
        <ResponsiveContainer width={'100%'} height={'100%'}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey={'year'} hide />
            <YAxis hide />
            {/* <Tooltip
              labelStyle={{ color: 'black' }}
              contentStyle={{ borderRadius: '8px' }}
              cursor={{ fill: 'transparent' }}
            /> */}
            <Bar dataKey={'count'} shape={customBar} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box className='slider-date-slider-container'>
        <Box className='date-slider-wrapper'>
          <Slider.Root 
            onValueChangeEnd={(e) => onFilterChange(e)}
            value={sliderVals}  
            min={1969} 
            max={2019} 
            onValueChange={(e) => setSliderVals(e.value)} 
            width='100%' 
            minStepsBetweenThumbs={1}>
            <Slider.Control>
              <Slider.Track bg={'black.300'}>
                <Slider.Range bg='green.200' />
              </Slider.Track>
              <Slider.Thumbs />
            </Slider.Control>
          </Slider.Root>
        </Box>
      </Box>
      <Flex color={'white'} justify={'space-between'} mt={1} px={'10px'}>
        <Text fontSize={'sm'}>{sliderVals[0]}</Text>
        <Text fontSize={'sm'}>{sliderVals[1]}</Text>
      </Flex>
    </Flex>
  )
}

function HistogramMonthlySlider(props: HistogramMonthlySliderType) {
  const { data, activeRange, onMonthChange } = props;
  const [sliderVals, setSliderVals] = useState([1, 12])

  const customBar = (props: BarShapeProps) => {
    const { x, y, width, height } = props;
    const { payload } = props;
    const ufoMonthlyCount = UfoSightingsByMonth.parse(payload);
    const isActive = parseInt(ufoMonthlyCount.month_label) >= activeRange.startMonth && parseInt(ufoMonthlyCount.month_label) <= activeRange.endMonth;
    const fillColor = isActive ? "#3182ce" : "#2d3748";
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fillColor}
        rx={2}
        style={{ transition: 'fill 0.3 ease' }}
      />
    )
  }

  return (
    <Flex direction={'column'} gap={0} position={'relative'} height={'100px'}>
      <Box height={'40px'} opacity={0.6}>
        <ResponsiveContainer width={'100%'} height={'100%'}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey={'month_label'} hide />
            <YAxis hide />
            {/* <Tooltip
              labelStyle={{ color: 'black' }}
              contentStyle={{ borderRadius: '8px' }}
              cursor={{ fill: 'transparent' }}
            /> */}
            <Bar dataKey={'sighting_count'} barSize={6} shape={customBar} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box px={'10px'} className='slider-date-slider-container'>
        <Box className='date-slider-wrapper'>
          <Slider.Root 
            onValueChangeEnd={(e) => onMonthChange(e)}
            value={sliderVals}  
            min={1} 
            max={12} 
            onValueChange={(e) => setSliderVals(e.value)} 
            width='100%' 
            minStepsBetweenThumbs={1}>
            <Slider.Control>
              <Slider.Track bg={'black.300'}>
                <Slider.Range bg='purple.200' />
              </Slider.Track>
              <Slider.Thumbs />
            </Slider.Control>
          </Slider.Root>
        </Box>
      </Box>
      <Flex justify={'space-between'} mt={1} px={'10px'}>
        <Text fontSize={'sm'} color={'whiteAlpha.600'}>{monthMap[sliderVals[0]]}</Text>
        <Text fontSize={'sm'} color={'whiteAlpha.600'}>{monthMap[sliderVals[1]]}</Text>
      </Flex>
    </Flex>
  )
}

export default function MapPage() {
  const [ufoBlipData, setUfoBlipData] = useState<AlienBlipSupabaseType>();
  const [filters, setFilters] = useState<Filter>({
    startYear: 1969,
    endYear: 2019
  });
  const [monthFilters, setMonthFilters] = useState<MonthlyFilters>({
    startMonth: 1,
    endMonth: 12
  });

  const [blipCount, setBlipCount] = useState(0);

  const [ufoYearlyCount, setUfoYearlyCount] = useState<UfoYearlyCountArray>([]);
  const [ufoMonthlyCount, setUfoMonthlyCount] = useState<UfoSightingsByMonthArrayType>([]);

  const [localDensity, setLocalDensity] = useState(0);
  const [currentCoordinates, setCurrentCoordinates] = useState<number[]>([]);
  const [currentViewMode, setCurrentViewMode] = useState<ViewingMode>("Pinpoints");

  const mapRef = useRef<MapRef>(null);
  const requestRef = useRef<number>(0);


  useEffect(() => {
    const getInitialBlipCount = async () => {
      const count = await getFilterCount({ startYear: 1969, endYear: 2019 });
      setBlipCount(count)
    }
    getInitialBlipCount();
  }, []);

  useEffect(() => {
    const getUfoCountsArray = async () => {
      const data = await getSigtingsCountByYear();
      setUfoYearlyCount(data);
    }

    const getUfoMonthlyCountsArray = async () => {
      const data = await getMonthlySighthingsByYear("1969", "2019");
      setUfoMonthlyCount(data);
    }

    getUfoCountsArray();
    getUfoMonthlyCountsArray();
  }, []);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const updateMapLayers = () => {
      const heatmap = map.getLayer("ufo-heatmap");
      const ufoPinpoints = map.getLayer("ufogeojson");
      if (heatmap && ufoPinpoints) {
        const isHeatMapMode = currentViewMode === 'Heatmap';
        map.setLayoutProperty('ufo-heatmap', 'visibility', isHeatMapMode ? 'visible' : 'none');
        map.setLayoutProperty('ufogeojson', 'visibility', isHeatMapMode ? 'none' : 'visible');
      }
    }

    if (map.isStyleLoaded()) {
      updateMapLayers();
    } else {
      map.once('styledata', updateMapLayers);
    }
  
  }, [currentViewMode]);



  useEffect(() => {
    let isMounted = true;
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    if (map.getLayer("ufogeojson") && map.getLayer("ufo-heatmap")) {
      console.log(filters);
      map.setFilter('ufogeojson', [
        'all',
        ['>=', ["to-number", ['slice', ['get', 'dt'], 0, 4]], filters.startYear],
        ['<=', ['to-number', ['slice', ['get', 'dt'], 0, 4]], filters.endYear],
        [">=", ["to-number", ['slice', ['get', 'dt'], 5, 7]], monthFilters.startMonth],
        ["<=", ['to-number', ['slice', ['get', 'dt'], 5, 7]], monthFilters.endMonth]
      ]);
      map.setFilter('ufo-heatmap', [
        'all',
        ['>=', ['to-number', ['slice', ['get','dt'], 0, 4]], filters.startYear],
        ['<=', ['to-number', ['slice', ['get', 'dt'], 0, 4]], filters.endYear],
        [">=", ["to-number", ['slice', ['get', 'dt'], 5, 7]], monthFilters.startMonth],
        ["<=", ['to-number', ['slice', ['get', 'dt'], 5, 7]], monthFilters.endMonth]
      ]);

      const getBlipCount = async () => {
        const getMonthCount = await getMonthlySighthingsByYear(filters.startYear.toString(), filters.endYear.toString());
        if (!isMounted) return;
        let count = 0;

        getMonthCount.forEach((monthData, idx) => {
          const monthNum = idx + 1;
          if (monthFilters.startMonth <= monthNum && monthNum <= monthFilters.endMonth) {
            count += monthData.sighting_count
          }
        });
        setBlipCount(count);
        setUfoMonthlyCount(getMonthCount);
      }
      getBlipCount();
    }
    return () => { isMounted = false };
  }, [filters, monthFilters]);

  const handleFlyToPoint = (lng: number, lat: number) => {
    if (mapRef.current && mapRef.current?.getZoom() < 8) {
      mapRef.current?.flyTo({
            center: [lng, lat],
            zoom: 8,
            speed: 1.2,
            curve: 1.42,
            essential: true
          })
    }
  }

  const animateGlow = (time: number) => {
    const map = mapRef.current?.getMap();
    if (!map || map.isMoving()) {
      requestRef.current = requestAnimationFrame(animateGlow);
      return;
    }
    const pulseBlur = 0.8 + Math.sin(time / 400) * 0.4;
    const pulseRadius = 12 + Math.sin(time / 400) * 3;

    map.setPaintProperty('ufo-highlight', 'circle-blur', pulseBlur);
    map.setPaintProperty('ufo-highlight', 'circle-radius', pulseRadius);
    requestRef.current = requestAnimationFrame(animateGlow);

  }

  const getPintPointData = async (id: number) => {
    const data = await getSightingDetails(id);
    setUfoBlipData(data);
  }

  const getLocalPinpointsDensity = async (lng: number, lat: number) => {
    const data = await getLocalDensity(lng, lat);
    setLocalDensity(data);
  } 

  const onFilterChange = (e: SliderValueChangeDetails) => {
    setFilters({ startYear: e.value[0], endYear: e.value[1] });
  }

  const onMonthlyDateSliderChange = (e: SliderValueChangeDetails) => {
    setMonthFilters({ startMonth: e.value[0], endMonth: e.value[1] });
  }

  return (
    <Box className='map-grid' height={'calc(100vh - 64px)'} w={'100%'} position={'relative'} overflow={'hidden'}>
      <Map
        ref={mapRef}
        style={{ width: '100%', height: '100%' }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAP_BOX_PUBLIC_ACCESS_TOKEN_UFO}
        minZoom={4}
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 4,
        }}
        onClick={(e) => {
          const feature = e.features && e.features[0];
          const map = mapRef.current?.getMap();
          if (feature && map) {
            const parsedData = validateAlienMapBlipSchema(feature.properties);
            getPintPointData(parsedData.id);

            if (feature.geometry.type === "Point") {
              const [lng, lat] = feature.geometry.coordinates;
              setCurrentCoordinates([lng, lat]);
              getLocalPinpointsDensity(lng, lat);
              handleFlyToPoint(lng, lat);
            }
            // const id = parsedData.id;
            // const map = mapRef.current?.getMap();
            
            // map?.setFilter('ufo-highlight', ["==", ["get", 'id'], id]);
            // if (!requestRef.current) {
            //   requestRef.current = requestAnimationFrame(animateGlow);
            // }
            
          }
        }}
        interactiveLayerIds={["ufogeojson", "ufo-heatmap"]}
        mapStyle="mapbox://styles/lezlus/cmns3wlho007u01sc8w1q82ef?refresh=true"
      >
        {currentCoordinates.length && (
          <Marker
            longitude={currentCoordinates[0]}
            latitude={currentCoordinates[1]}
            anchor='center'
            draggable={false}
          >
            <div className='ufo-pulse-marker' />
          </Marker>
        )}
      </Map>
      <Box 
        pos={'absolute'}
        top={'4'}
        bottom={'4'}
        right={'0'}
        width={'350px'}
        zIndex={'20'}
        pr={'4'}
        pointerEvents={ufoBlipData ? 'auto' : 'none'}
        transition={'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'}
        transform={ufoBlipData ? "translateX(0)" : "translateX(110%)"}
        display={'flex'}
        flexDir={'column'}
        gap={'4'}
      >
        <Card.Root className='data-card' variant={'elevated'} bg='rgba(26, 32, 44, 0.1)' backdropFilter={'blur(8px)'}>
          <Card.Body>
            <Flex direction={'column'}>
              {ufoBlipData && 
                <Flex color={'white.200'} gap={3} direction='column'>
                  <Flex justifyContent={'space-between'}>
                    <Text>City:</Text>
                    <Text>{ufoBlipData?.city}</Text>
                  </Flex>
                  <Flex justifyContent={'space-between'}>
                    <Text>State:</Text>
                    <Text>{ufoBlipData?.state}</Text>
                  </Flex>
                  <Flex justifyContent={'space-between'}>
                    <Text>Duration:</Text>
                    <Text>{ufoBlipData?.duration}</Text>
                  </Flex>
                  <Flex justifyContent={'space-between'}>
                    <Text>Date:</Text>
                    <Text>{`${new Date(ufoBlipData?.date).toDateString()} ${new Date(ufoBlipData.date).toLocaleTimeString()}`}</Text>
                  </Flex>
                  <Flex direction={'column'} gap={1} mt={2}>
                    <Text fontWeight={'bold'} fontSize={'xs'} color={'gray.400'} textTransform={'uppercase'}>
                      Sighting Description
                    </Text>
                    <Box
                      key={ufoBlipData?.id}
                      animation={`${revealText} 0.4s ease-out both`}
                      bg={'blackAlpha.300'}
                      p={3}
                      borderRadius={'md'}
                      border='1px solid'
                      borderColor={'whiteAlpha.100'}
                      maxH={'350px'}
                      overflowY={'auto'}
                      css={{
                        '&::-webkit-scrollbar': { width: '4px' },
                        '&::-webkit-scrollbar-thumb': { background: '#444', borderRadius: '10px' }
                      }}
                    >
                      <Text fontSize='sm' lineHeight={'tall'} color={'gray.200'}>
                        {ufoBlipData?.text}
                      </Text>
                    </Box>
                  </Flex>
                  { currentCoordinates.length === 2 ? <CompassElement lat={currentCoordinates[1]} lng={currentCoordinates[0]} /> : ""}
                  <Text fontSize={'sm'}>
                    There are <strong>{localDensity}</strong> other documented sightings within 50 miles of this location
                  </Text>
                </Flex>
              }        
            </Flex>
          </Card.Body>
        </Card.Root>
        {/* <Card.Root className='context-card' variant={'elevated'} bg={'rgba(26, 32, 44, 0.1)'} backdropFilter={'blur(8px)'}>
          <Card.Body>
            { currentCoordinates.length === 2 ? <CompassElement lat={currentCoordinates[1]} lng={currentCoordinates[0]} /> : ""}
            <Text fontSize={'sm'}>
              There are <strong>{localDensity}</strong> other documented sightings within 50 miles of this location
            </Text>
          </Card.Body>
        </Card.Root> */}
      </Box>
      <Box
        position={'absolute'}
        top={'4'}
        left={'4'}
        zIndex={'10'}
        width={'100px'}
      >
        <SegmentGroup.Root
          color={'whiteAlpha.100'}
          value={currentViewMode} 
          p={1}
          background={"#0B0F1A"}
          onValueChange={(e) => setCurrentViewMode(e.value as ViewingMode)} 
          css={{
            "--segment-indicator-bg": '#121826',
          }}
        >
          <SegmentGroup.Indicator _selected={{ "color": "white" }} />
          {["Pinpoints", "Heatmap"].map((item) => (
            <SegmentGroup.Item key={item} value={item}>
              <SegmentGroup.ItemText
                color={'whiteAlpha.600'}
                _selected={{ color: 'white' }}
                transition="color 0.2s"
                zIndex={"1"}
              >
                {item}
              </SegmentGroup.ItemText>
              <SegmentGroup.ItemHiddenInput />
            </SegmentGroup.Item>
          ))}
        </SegmentGroup.Root>
        {/* <Card.Root variant={'elevated'} bg={'rgba(26, 32, 44, 0.1)'} backdropFilter={'blur(8px)'}>
          <Card.Body>
            <SegmentGroup.Root value={currentViewMode} onValueChange={(e) => setCurrentViewMode(e.value as ViewingMode)} >
              <SegmentGroup.Indicator />
              <SegmentGroup.Items items={["Pinpoints", "Heatmap"]} />
            </SegmentGroup.Root>
          </Card.Body>
        </Card.Root> */}
      </Box>
      {/* Filters */}
      <Box
        position={'absolute'}
        bottom={'4'}
        left={'4'}
        zIndex={'10'}
        width={'400px'}
        transition={'all 0.3s ease-in-out'}
        // _hover={{ transform: 'scale(1.02)', width: '450px' }}
      >
        <Card.Root  animation={"slide-from-bottom 0.6 var(--chakra-curve-ease-out)"} variant={'elevated'} bg={'rgba(26, 32, 44, 0.1)'} backdropFilter={'blur(8px)'}>
          <Card.Body>

            <Text color={'white'} mb={2} fontSize={'xs'} fontWeight={'bold'}>
              GLOBAL SIGHTINGS: {blipCount}
            </Text>
            <HistogramSlider activeRange={filters} data={ufoYearlyCount} onFilterChange={onFilterChange} />
            <HistogramMonthlySlider activeRange={monthFilters} data={ufoMonthlyCount} onMonthChange={onMonthlyDateSliderChange} />
          </Card.Body>
        </Card.Root>
      </Box>
      {/* Data Card */}
      {/* <Box
        // key={ufoBlipData?.id}
        // animation={`${revealText} 0.4s ease-out both`}
        position={'absolute'}
        // p={3}
        top={'4'}
        right={'4'}
        bottom={'4'}
        zIndex={'10'}
        width='320px'
      >
        <Card.Root className='data-card' variant={'elevated'} bg='rgba(26, 32, 44, 0.1)' backdropFilter={'blur(8px)'}>
          <Card.Body>
            <Flex direction={'column'}>
              <Heading size={'sm'} mb={4}>Data</Heading>
              <Flex color={'white.200'} gap={3} direction='column'>
                <Flex justifyContent={'space-between'}>
                  <Text>City:</Text>
                  <Text>{ufoBlipData?.city}</Text>
                </Flex>
                <Flex justifyContent={'space-between'}>
                  <Text>State:</Text>
                  <Text>{ufoBlipData?.state}</Text>
                </Flex>
                <Flex justifyContent={'space-between'}>
                  <Text>Duration:</Text>
                  <Text>{ufoBlipData?.duration}</Text>
                </Flex>
                <Flex justifyContent={'space-between'}>
                  <Text>Date:</Text>
                  <Text>{ufoBlipData?.date}</Text>
                </Flex>
                <Flex direction={'column'} gap={1} mt={2}>
                  <Text fontWeight={'bold'} fontSize={'xs'} color={'gray.400'} textTransform={'uppercase'}>
                    Sighting Description
                  </Text>
                  <Box
                    key={ufoBlipData?.id}
                    animation={`${revealText} 0.4s ease-out both`}
                    bg={'blackAlpha.300'}
                    p={3}
                    borderRadius={'md'}
                    border='1px solid'
                    borderColor={'whiteAlpha.100'}
                    maxH={'400px'}
                    overflowY={'auto'}
                    css={{
                      '&::-webkit-scrollbar': { width: '4px' },
                      '&::-webkit-scrollbar-thumb': { background: '#444', borderRadius: '10px' }
                    }}
                  >
                    <Text fontSize='sm' lineHeight={'tall'} color={'gray.200'}>
                      {ufoBlipData?.text}
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            </Flex>
          </Card.Body>
        </Card.Root>
      </Box> */}
      {/* Context Card */}
      {/* <Box
        position={'absolute'}
        bottom={'4'}
        right={'4'}
        zIndex={'10'}
      >
        <Card.Root className='context-card' variant={'elevated'} bg={'rgba(26, 32, 44, 0.1)'} backdropFilter={'blur(8px)'}>
          <Card.Body>
            { currentCoordinates.length === 2 ? <CompassElement lat={currentCoordinates[1]} lng={currentCoordinates[0]} /> : ""}
            <Text fontSize={'xs'} border={'1px solid'}>
              Area Alert:
            </Text>
            <Text fontSize={'sm'}>
              There are <strong>{localDensity}</strong> other documented sightings within 50 miles of this location
            </Text>
          </Card.Body>
        </Card.Root>
      </Box> */}
    </Box>
  );
}