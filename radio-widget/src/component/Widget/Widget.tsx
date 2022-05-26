import React, { useEffect, useState } from 'react';
import arrowIcon from '../../images/back-arrow.png';
import cover from '../../images/cover-img.png';
import minus from '../../images/minus.png';
import plus from '../../images/plus.png';
import switchIcon from '../../images/switch.png';
import './Widget.css';

interface Station {
    _id: number;
    station_name: string;
    postcode: number;
}

const Widget = () => {
    const [stations, setStations] = useState<Station[]>([]);
    const [displayStation, setDisplayStation] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://peaceful-mountain-98601.herokuapp.com/station')
            .then((res) => res.json())
            .then((data) => setStations(data))
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleClick = (e: any) => {
        if (e.target.textContent !== displayStation) {
            setDisplayStation(e.target.textContent);
        } else {
            setDisplayStation('');
        }
    };

    return (
        <div className="widget-container">
            <div className="widget">
                <div className="widget-title">
                    <div>
                        <img width="16px" src={arrowIcon} alt="" />
                    </div>
                    <div>
                        <h2>Stations</h2>
                    </div>
                    <div>
                        <img width="20px" src={switchIcon} alt="" />
                    </div>
                </div>
                {loading ? (
                    <h3 className="loading">Loading...</h3>
                ) : (
                    <div className="station-container">
                        {stations.map((station) => (
                            <div className="station-list" key={station._id}>
                                <div className="station">
                                    <span className="stname" onClick={handleClick}>
                                        {station.station_name}
                                    </span>{' '}
                                    <span>{station.postcode}</span>
                                </div>
                                {displayStation === station.station_name && (
                                    <div className="cover-img">
                                        <div>
                                            <img width="35px" src={minus} alt="" />
                                        </div>
                                        <div>
                                            <img width="150px" src={cover} alt="" />
                                        </div>
                                        <div>
                                            <img width="35px" src={plus} alt="" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="widget-bottom">
                    {displayStation && (
                        <>
                            <p>Currently playing</p>
                            <h4>{displayStation}</h4>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Widget;
