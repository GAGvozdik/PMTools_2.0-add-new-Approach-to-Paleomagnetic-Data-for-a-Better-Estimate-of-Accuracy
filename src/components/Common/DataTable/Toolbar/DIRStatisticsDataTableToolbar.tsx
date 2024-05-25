import { 
  GridToolbarContainer, 
  GridToolbarColumnsButton, 
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { useAppSelector } from "../../../../services/store/hooks";
import { IDirData } from "../../../../utils/GlobalTypes"; 
import ExportDIRFromDIR from "./Buttons/ExportButton/ExportDIRFromDIR";

const DIRStatisticsDataTableToolbar = () => {

  const { currentFileInterpretations, outputFilename } = useAppSelector(state => state.dirPageReducer);

  if (!currentFileInterpretations) return null;
  const data: IDirData = {
    name: outputFilename,
    interpretations: currentFileInterpretations.map((interpretation, index) => {
      return {
        id: index + 1,
        label: interpretation.label,
        code: interpretation.code || '',
        stepRange: interpretation.stepRange,
        stepCount: interpretation.stepCount,
        Dgeo: interpretation.Dgeo,
        Igeo: interpretation.Igeo,
        Dstrat: interpretation.Dstrat,
        Istrat: interpretation.Istrat,
        MADgeo: interpretation.confidenceRadiusGeo,
        Kgeo: interpretation.Kgeo || 0,
        MADstrat: interpretation.confidenceRadiusGeo,
        Kstrat: interpretation.Kgeo || 0,
        comment: interpretation.comment,
        demagType: interpretation.demagType,
        d: interpretation.d || null || undefined,
        lat: interpretation.lat || null || undefined,
        lon: interpretation.lon || null || undefined,
        RZ: interpretation.RZ || null || undefined,
        alpha95: interpretation.alpha95 || null || undefined,
        PCaPC: interpretation.PCaPC || null || undefined,
        q: interpretation.q || null || undefined,
        gridN: interpretation.gridN || null || undefined,
        alpha95Square: interpretation.alpha95Square || null || undefined,
        zoneSquare: interpretation.zoneSquare || null || undefined,
        probability: interpretation.probability || null || undefined,
      };
    }),
    format: '',
    created: ''
  };

  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <ExportDIRFromDIR data={data}/>
    </GridToolbarContainer>
    // <></>
  );
};

export default DIRStatisticsDataTableToolbar;
