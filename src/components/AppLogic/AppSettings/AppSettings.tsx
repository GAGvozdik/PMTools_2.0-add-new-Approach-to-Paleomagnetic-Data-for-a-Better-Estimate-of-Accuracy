import React, { FC, useEffect, useState } from "react";
import styles from './AppSettings.module.scss';
import { IconButton, Button, Input } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { useAppDispatch, useAppSelector } from "../../../services/store/hooks";
import { useTheme } from '@mui/material/styles';
import {
  textColor
} from '../../../utils/ThemeConstants';
import { useMediaQuery } from "react-responsive";
import ModalWrapper from "../../Common/Modal/ModalWrapper";
import SettingsModal from "../../Common/Modal/SettingsModal/SettingsModal";
import { setHotkeys } from "../../../services/reducers/appSettings";

import { DefaultButton, DefaultResponsiveButton } from "../../Common/Buttons";
import { useTranslation } from "react-i18next";
import { HotkeysType } from "../../../utils/GlobalTypes";
import { useDefaultHotkeys } from "../../../utils/GlobalHooks";
import HelpModal from "../../Common/Modal/HelpModal/HelpModal";

interface IAppSettings {
  onFileUpload: (event: any, files?: Array<File>) => void;
  dndInputProps: any;
  currentPage: string;
};

const AppSettings: FC<IAppSettings> = ({
  onFileUpload,
  dndInputProps,
  currentPage,
}) => {

  const theme = useTheme();
  const { t, i18n } = useTranslation('translation');
  const dispatch = useAppDispatch();
  const widthLessThan1400 = useMediaQuery({ query: '(max-width: 1400px)' });

  const defaultHotkeys = useDefaultHotkeys();
  const { hotkeys } = useAppSelector(state => state.appSettingsReducer);

  const availableFormats = {
    pca: ['.pmd', '.squid', '.rs3', '.csv', '.xlsx'],
    dir: ['.dir', '.pmm', '.csv', '.xlsx'], 
    Khokhlov_Gvozdik: ['.dir', '.pmm', '.csv', '.xlsx'], 
  };

  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const onSettingsClick = () => {
    setShowSettings(true);
  };

  const onHelpClick = () => {
    setShowHelp(true);
  };

  const loadHotkeys = () => {
    const hotkeysStored: HotkeysType = JSON.parse(localStorage.getItem('hotkeys')!);
  
    if (!hotkeysStored || !hotkeysStored.length) {
      // Дублирование функционала, актуальная операция в редьюсере
      // localStorage.setItem('hotkeys', JSON.stringify(defaultHotkeys));
      return defaultHotkeys;
    }
  
    return hotkeysStored;
  };

  useEffect(() => {
    if (!hotkeys.length) dispatch(setHotkeys(loadHotkeys()));
  }, []);

  return (
    <>
      <div className={styles.buttons}>
        <DefaultResponsiveButton
          icon={<SettingsOutlinedIcon />}
          text={t('appLayout.settings.settings')}
          onClick={onSettingsClick}
        />
        <DefaultResponsiveButton
          icon={<HelpOutlineOutlinedIcon />}
          text={t('appLayout.settings.help')}
          onClick={onHelpClick}
        />
        <label 
          htmlFor="upload-file" 
          style={{
            flex: 'auto'
          }}
        >
          {
            (currentPage === 'pca' || currentPage === 'dir' || currentPage === 'Khokhlov_Gvozdik') &&
            <Input 
              id="upload-file"
              type={'file'}  
              inputProps={{
                ...dndInputProps,
                multiple: true,
                accept: availableFormats[currentPage].join(', '),
              }}
              disableUnderline={true}
              sx={{display: 'none'}}
            />
          }

          <DefaultResponsiveButton
            icon={<UploadFileOutlinedIcon />}
            text={t('appLayout.settings.import')}
            variant='outlined'
            disabled={currentPage !== 'pca' && currentPage !== 'dir' && currentPage !== 'Khokhlov_Gvozdik'}
            component="span"
            id="upload-file-button"
          />
        </label>
      </div>
      <ModalWrapper
        open={showSettings}
        setOpen={setShowSettings}
        size={{width: '60vw', height: '60vh'}}
      >
        <SettingsModal />
      </ModalWrapper>
      <ModalWrapper
        open={showHelp}
        setOpen={setShowHelp}
        // size={{width: '21vw', height: '12vh'}}
      >
        <HelpModal />
      </ModalWrapper>
    </>
  )
}

export default AppSettings;
