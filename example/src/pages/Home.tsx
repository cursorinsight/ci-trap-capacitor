import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Preferences } from '@capacitor/preferences';

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  useIonToast,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';

import './Home.css';
import { TrapConfig, CapacitorTrap, CollectorTypes } from 'ci-trap-capacitor';

const sessionIdKey : string = 'ci-trap-sessionId'

const Home: React.FC = () => {
  const [metaKey, setMetaKey] = useState('');
  const [metaValue, setMetaValue] = useState<any>();
  const [dataSource, setDataSource] = useState<CollectorTypes>();
  const [present] = useIonToast();

  const getSessionId = useCallback(async() => {
    let { value: sessionId } = await Preferences.get({key: sessionIdKey})
    if (sessionId === null) {
      sessionId = uuidv4()
      await Preferences.set({key: sessionIdKey, value: sessionId})
    }
    return sessionId
  }, [])

  const initTrap = useCallback(async () => {
    const config = new TrapConfig();
    config.reporter.url = "http://[SERVER_URL]/api/1/submit/{sessionId}/{streamId}"
    config.reporter.sessionId = await getSessionId()

    return CapacitorTrap.configure({config});
  }, [getSessionId])

  const presentToast = useCallback((message: string) => {
    present({
      message,
      duration: 1500,
      position: 'middle',
    });
  }, []);

  const ensureSuccess = useCallback(async (request: Promise<void>) => {
    try {
      await request
    } catch (exception) {
      presentToast(`${exception}`)
    }
  }, [presentToast]);

  useEffect(() => {
    ensureSuccess(initTrap())

    return () => { CapacitorTrap.cleanUp(); }
  }, [ensureSuccess, initTrap]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Trap Capacitor Sample</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Trap Capacitor Sample</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Permission</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonSelect
              aria-label="dataSource"
              placeholder="Select DataSource"
              onIonChange={(e) => {
                setDataSource(e.detail.value)
              }}
              value={dataSource}
            >
              {Object.keys(CollectorTypes).map(key => (
                <IonSelectOption key={key} value={key}>{key}</IonSelectOption>
              ))}
            </IonSelect>
            <IonButton onClick={() => {
              if (dataSource != null) {
                CapacitorTrap
                  .checkPermission({ collector: dataSource })
                  .then(result => {
                    presentToast(
                      `${dataSource} request result: ${result.result}`);
                })
                .catch(error => presentToast(`${error}}`))
              }
            }}>
              Check
            </IonButton>
            <IonButton onClick={() => {
              if (dataSource != null) {
                ensureSuccess(
                  CapacitorTrap.requestPermission({ collector: dataSource }))
              }
            }}>
              Request
            </IonButton>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Start / stop</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton onClick={() => { ensureSuccess(CapacitorTrap.start()) }}>
              Start
            </IonButton>
            <IonButton onClick={() => { ensureSuccess(CapacitorTrap.stop()) }}>
              Stop
            </IonButton>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Metadata</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonInput
              value={metaKey}
              label='Meta key'
              labelPlacement='floating'
              type='text'
              onIonInput={(ev) =>
                setMetaKey(ev.target.value?.toString() ?? '')}
            />
            <IonInput
                value={metaValue}
                label='Meta value'
                labelPlacement='floating'
                onIonInput={(ev) =>
                  setMetaValue(ev.target.value)}
            />
            <IonButton onClick={() => {ensureSuccess(CapacitorTrap
                .addCustomMetadata({key: metaKey, value: metaValue}))
            }}>
              Add metadata
            </IonButton>
            <IonButton onClick={() => {ensureSuccess(CapacitorTrap
              .removeCustomMetadata({key: metaKey}))
            }}>
              Remove metadata
            </IonButton>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Custom event</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton onClick={() => {ensureSuccess(CapacitorTrap
              .addCustomEvent({event: {
                stringValue: "someString",
                intValue: 12,
                floatValue: 1234.56,
                objectValue: {
                  something: "abc",
                  else: 12
                },
                arrayValue: [ 1, 2, 3, 4]
              }}))
            }}>
              Add custom event
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;
